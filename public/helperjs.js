export const getUnnamedParams = () => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const pathSegments = url.pathname.split("/");
  const userId = pathSegments[pathSegments.length - 1];
  return userId;
};
