import React from "react";

export default function ProtectNavigation({ children }) {
  React.useEffect(() => {
    // BLOCK REFRESH / CLOSE TAB
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // BLOCK BROWSER BACK BUTTON
    const handleBackButton = (e) => {
      const confirmation = window.confirm(
        "Yakin ingin kembali? Perubahan yang belum disimpan akan hilang."
      );
      if (!confirmation) {
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  return <>{children}</>;
}
