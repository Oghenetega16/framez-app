import { CommonActions, StackActions } from '@react-navigation/native';

export const navigationUtils = {
    // Reset navigation to a specific screen
    reset: (navigation: any, routeName: string) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: routeName }],
            })
        );
    },

    // Go back with fallback
    goBackOrNavigate: (navigation: any, fallbackRoute: string) => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate(fallbackRoute);
        }
    },

    // Replace current screen
    replace: (navigation: any, routeName: string, params?: any) => {
        navigation.dispatch(StackActions.replace(routeName, params));
    },

    // Pop to top of stack
    popToTop: (navigation: any) => {
        navigation.dispatch(StackActions.popToTop());
    },
};