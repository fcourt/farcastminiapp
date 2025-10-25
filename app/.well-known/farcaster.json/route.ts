import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
  // TODO: Add your own account association
    accountAssociation: {
    "header": "eyJmaWQiOjM0NzU1MiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDE3ZjRjRUI1YmU5OWQyN2Q4ZGFDNGMwYkI3NjM1Qzc5RTQ4MDU2Q2EifQ",
    "payload": "eyJkb21haW4iOiJmYXJjYXN0LW1pbmlhcHAudmVyY2VsLmFwcCJ9",
    "signature": "l/YT4Cc1S/NErqrageTULIGLjHVmTCN24UiN+gwP48lF12W0eL+1mX+ssujqDxk+HkmJAwOs0n4kCN6Mby3enhs="
  },
    frame: {
      version: "1",
      name: "Farcaster-MiniApp by fcourt",
      iconUrl: `${APP_URL}/images/icon.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/images/feed.png`,
      screenshotUrls: [],
      tags: ["Base", "farcaster", "miniapp", "template"],
      primaryCategory: "developer-tools",
      buttonTitle: "Launch Template",
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#ffffff",
      webhookUrl: `${APP_URL}/api/webhook`,
    },
  };

  return NextResponse.json(farcasterConfig);
}
