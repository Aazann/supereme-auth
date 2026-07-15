import { NextResponse } from "next/server";

export async function GET() {
  const spec = {
    openapi: "3.0.0",
    info: {
      title: "BetterAuth Studio REST API",
      description: "Direct administrative endpoints to moderate users, audit device sessions, and configure tenant settings in Better Auth.",
      version: "1.0.0"
    },
    servers: [
      {
        url: "/api/v1",
        description: "Local BetterAuth Studio server"
      }
    ],
    paths: {
      "/users": {
        get: {
          summary: "List all registered users",
          responses: {
            "200": {
              description: "Array of users and active sessions count"
            }
          }
        }
      },
      "/users/ban": {
        post: {
          summary: "Ban a registered user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["userId"],
                  properties: {
                    userId: { type: "string" },
                    reason: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "User banned successfully"
            }
          }
        }
      },
      "/sessions/revoke": {
        post: {
          summary: "Revoke an active session token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["sessionId"],
                  properties: {
                    sessionId: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Session revoked successfully"
            }
          }
        }
      },
      "/health": {
        get: {
          summary: "Get server latency and database stats",
          responses: {
            "200": {
              description: "JSON showing ping delay and node memory specs"
            }
          }
        }
      }
    }
  };

  return NextResponse.json(spec);
}
