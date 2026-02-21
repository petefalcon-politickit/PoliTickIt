import * as Linking from "expo-linking";
import { router } from "expo-router";
import { INavigationService } from "../interfaces/INavigationService";

export class NavigationService implements INavigationService {
  navigateToEntity(type: string, id: string): void {
    console.log(`[NavigationService] Navigating to ${type}:${id}`);

    // In a real app, these would map to specific routes
    // For now, we route to a generic detail page or the modal
    switch (type.toLowerCase()) {
      case "representative":
      case "rep":
        router.push({
          pathname: "/representative",
          params: { id },
        });
        break;
      case "bill":
        router.push({
          pathname: "/modal",
          params: { id, type: "bill" },
        });
        break;
      case "snap":
        router.push({
          pathname: "/snap-viewer",
          params: { id },
        });
        break;
      default:
        // Fallback for generic entities
        router.push("/modal");
        break;
    }
  }

  navigateToSearch(query: string, category?: string): void {
    console.log(`[NavigationService] Searching for ${query} in ${category}`);
    router.push({
      pathname: "/accountability" as any,
      params: { q: query, cat: category },
    });
  }

  async openExternalSource(url: string): Promise<void> {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn(`[NavigationService] Cannot open URL: ${url}`);
    }
  }

  navigateToContact(repId: string | any): void {
    console.log(`[NavigationService] Navigating to contact for: ${repId}`);
    // Currently, we route to the representative page as it contains contact info
    // In a mature app, this could be a specialized feedback/contact form
    router.push({
      pathname: "/representative",
      params: {
        id: typeof repId === "string" ? repId : repId?.id,
        action: "contact",
      },
    });
  }

  navigate(routeName: string, params?: any): void {
    console.log(`[NavigationService] Navigating to ${routeName}`, params);

    // Map common names to actual routes if necessary
    let pathname = routeName;
    if (!pathname.startsWith("/")) {
      pathname = `/${routeName}` as any;
    }

    router.push({
      pathname: pathname as any,
      params,
    });
  }
}
