'use client';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

// クライアントの生成
const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_COGNITO_REGION,
});

// トークンの保存
const setIdToken = (token: string, expiresIn: number) => {
  document.cookie = `cit=${token}; Secure; SameSite=Strict; Max-Age=${expiresIn}; Path=/`;
};

// トークンの取得
const getIdToken = () => {
  if (typeof window === 'undefined') return;
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('cit=')
  );
  return tokenCookie ? tokenCookie.split('=')[1] : null;
}

// トークンの削除
export const removeIdToken = () => {
  document.cookie = 'cit=; Secure; SameSite=Strict; Max-Age=0; Path=/';
}

// トークンの有効期限切れ判定
export const isTokenExpiringSoon = (
  bufferSeconds: number = 300 // デフォルト5分
): boolean => {
  interface DecodedToken {
    exp?: number;  // トークンの有効期限（UNIX タイムスタンプ）
  }
  const token = getIdToken();
  if (!token) return true;

  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload)) as DecodedToken;

    if (!decodedPayload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);

    return decodedPayload.exp < (currentTime + bufferSeconds);
  } catch (error) {
    console.error('Token validation error:', error);
    return true;
  }
};

// ログイン処理
export const login = async (username: string, password: string) => {
  try {
    const res = await client.send(
      new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      })
    );
    if (!!res.ChallengeName) {
      alert('先にCognitoの管理画面で本パスワードの設定を行ってください');
    }
    if (!!res.AuthenticationResult) {
      setIdToken(
        res.AuthenticationResult.IdToken!,
        res.AuthenticationResult.ExpiresIn!
      );
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// sdkクライアント用 クレデンシャル取得処理
export const getCognitoCredentials = async () => {
  if (typeof window === 'undefined') return;
  const idToken = getIdToken();
  if (!idToken) {
    throw new Error('トークンがありません');
  }
  return fromCognitoIdentityPool({
    client: new CognitoIdentityClient({
      region: process.env.NEXT_PUBLIC_COGNITO_REGION,
    }),
    identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID!,
    logins: {
      [`cognito-idp.${process.env.NEXT_PUBLIC_COGNITO_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`]:
        idToken,
    },
  });
};
