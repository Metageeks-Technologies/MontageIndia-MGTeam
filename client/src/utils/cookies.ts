
export const getPrefLangCookie = (): string => {
  if (typeof window === 'undefined') {
    console.log("Server-side rendering, returning default value");
    return "/auto/en"; // Default value for server-side rendering
  }

  const value = document.cookie.split('; ').find(row => row.startsWith('googtrans='))?.split('=')[1];
  const result = value ? decodeURIComponent(value) : "/auto/en";
  console.log("getPrefLangCookie result:", result);
  return result;
};

export const setPrefLangCookie = (value: string): void => {
  if (typeof window !== 'undefined') {
    console.log("Setting cookie value:", value);
    const now = new Date();
    const time = now.getTime();
    const expireTime = time + 1000 * 36000;
    now.setTime(expireTime);

    // Delete existing cookies
    console.log("Deleting existing cookies");
    // document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname + ";";
    // document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + location.hostname.split('.').slice(-2).join('.') + ";";

    // Set new cookies
    console.log("Setting new cookies");
   document.cookie = `googtrans=${encodeURIComponent(value)}; expires=${now.toUTCString()}; path=/`;
    document.cookie = `googtrans=${encodeURIComponent(value)}; expires=${now.toUTCString()}; path=/; domain=${location.hostname}`;
    document.cookie = `googtrans=${encodeURIComponent(value)}; expires=${now.toUTCString()}; path=/; domain=.${location.hostname.split('.').slice(-2).join('.')}`;

    console.log("Cookies after setting:", document.cookie);
  } else {
    console.log("Window is undefined, cannot set cookie");
  }
};