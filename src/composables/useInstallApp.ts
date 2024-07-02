import { ref, onBeforeMount, onBeforeUnmount } from "vue";

export const useInstallApp = () => {
  const deferredPrompt = ref();

  const handleInstallApp = async () => {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt();
      const { outcome } = await deferredPrompt.value.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      deferredPrompt.value = null;
    }
  };

  const handleBeforeInstallPrompt = (e: Event) => {
    e.preventDefault();
    deferredPrompt.value = e;
  };

  onBeforeMount(() => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  });

  onBeforeUnmount(() => {
    window.removeEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );
  });

  return {
    deferredPrompt,
    handleInstallApp,
  };
};
