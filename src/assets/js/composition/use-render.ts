import { Debug } from '@/assets/js/debug';

export default {
  setup(props: any, context: any, controlState: any) {
    const isDisabled = (controlCode: string, hasError: boolean = false) => {
      if (hasError) {
        return true;
      }
      if (controlState.fullControl) {
        return false;
      } else {
        if (!controlState.controls) return true;
        return (
          controlState.controls.filter((item: any) => item.controlCode === controlCode && item.disableControl === false)
            .length === 0
        );
      }
    };

    const isRendered = (controlCode: string, isRendered: boolean = true) => {
      if (!isRendered) {
        return false;
      }

      if (controlState.fullControl) {
        return true;
      } else {
        if (!controlState.controls) return false;
        return (
          controlState.controls.filter((item: any) => item.controlCode === controlCode && item.renderControl === true)
            .length > 0
        );
      }
    };

    const hasPermission = (event: any) => {
      let eleId = null;
      if (typeof event === 'object') {
        if (event.currentTarget.id === undefined || event.currentTarget.id.length === 0) {
          Debug.errorSection('hasPermission', `ID of ${event.currentTarget} was not set`);
          return false;
        }
        eleId = event.currentTarget.id;
      } else {
        eleId = event;
      }
      return !isDisabled(eleId);
    };

    const checkControlProperty = (event: any, property: string) => {
      let eleId = null;
      if (typeof event === 'object') {
        if (event.currentTarget.id === undefined || event.currentTarget.id.length === 0) {
          Debug.errorSection(property, `ID of ${event.currentTarget} was not set`);
          return false;
        }
        eleId = event.currentTarget.id;
      } else {
        eleId = event;
      }

      if (!controlState.fullControl) {
        if (
          controlState.controls.filter((item: any) => item.controlCode === eleId && item[property] === false).length > 0
        ) {
          return false;
        }
      } else {
        return false;
      }

      return true;
    };

    const requirePassword = (event: any, controlState: any) => {
      return checkControlProperty(event, 'requirePassword');
    };

    const confirm = (event: any, controlState: any) => {
      return checkControlProperty(event, 'confirm');
    };

    return {
      isDisabled,
      isRendered,
      hasPermission,
      requirePassword,
      confirm
    };
  }
};
