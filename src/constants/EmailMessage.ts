export const EmailMessage = {
  VERIFICATION: (code: number) => `Your code is ${code}`,
  INVITATION: (token: string, clientUrl: string) =>
    `You have been invited to the application Think AI. Follow the link and create a password to access your account: ${clientUrl}/accept-invitation?userEmail=${token}`,
};
