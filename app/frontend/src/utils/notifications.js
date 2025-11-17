import { showMessage } from "react-native-flash-message";
const DEFAULT_DURATION = 3500;
const baseConfig = {
    floating: true,
    hideOnPress: true,
    duration: DEFAULT_DURATION,
    position: "top",
};
const createNotifier = (type, defaultIcon) => (message, description, options = {}) => {
    const { icon, ...rest } = options;
    showMessage({
        ...baseConfig,
        ...rest,
        message,
        description,
        type,
        icon: icon ?? defaultIcon,
    });
};
export const showSuccessNotification = createNotifier("success", "success");
export const showErrorNotification = createNotifier("danger", "danger");
export const showInfoNotification = createNotifier("info", "info");
