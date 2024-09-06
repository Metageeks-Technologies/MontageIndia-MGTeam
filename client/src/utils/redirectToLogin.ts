export const redirectToLogin = (router: any, pathname: any) => {
  router.push(`/auth/user/login?redirect=${pathname}`);
};
