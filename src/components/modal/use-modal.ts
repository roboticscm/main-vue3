import { inject, reactive, onMounted, onUnmounted } from 'vue';
import { Settings } from '@/types/base/system';
import { Window } from '@/assets/js/window';
import { UrlUtil } from '@/assets/js/url-util';

export default {
  setup(props: any, context: any, modalRef: any) {
    const { settingsStore } = inject('store');

    const modalState = reactive({
      width: null,
      height: null,
      left: null,
      top: null,
      onOkCallback: null,
      onCancelCallback: null,
      onCloseCallback: null,
      resolve: null,
      content: ''
    });

    const dragElement = (elmnt: any) => {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      const dragMouseDown = (e: any) => {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      };
      if (document.getElementById(elmnt.id + 'header')) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
      } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
      }

      const elementDrag = (e: any) => {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
        elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
        // modalState.left = elmnt.style.left;
        // modalState.top = elmnt.style.top;
      };

      const closeDragElement = () => {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      };
    };

    const saveSettings = (keys: string[], values: string[]) => {
      let obj = new Settings();
      obj.menuPath = UrlUtil.getMenuPathFromUrl();
      // obj.menuPath = 'system/modal';
      obj.controlId = props.id;
      obj.keys = keys;
      obj.values = values;

      settingsStore.saveOrUpdate(obj);
    };

    const loadSettings = () => {
      settingsStore
        .getUserSettings(UrlUtil.getMenuPathFromUrl(), props.id)
        .then((res: any) => {
          if (res && res.length === 4) {
            res.map((it: any) => {
              if (modalRef.value) {
                modalRef.value.style[it.key] = it.value;
              }

              return it;
            });
          } else {
            // default value for first times
            const widthInPixel = props.widthInPixel ? props.widthInPixel : 500;
            const heightInPixel = props.heightInPixel ? props.heightInPixel : 200;

            const pos = Window.getCenterWindowPosition(widthInPixel, heightInPixel);

            if (modalRef.value) {
              modalRef.value.style.width = `${widthInPixel}px`;
              modalRef.value.style.height = `${heightInPixel}px`;
              modalRef.value.style.left = `${pos.left}px`;
              modalRef.value.style.top = `${pos.top}px`;
            }
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    };

    const onMouseUp = () => {
      if (!modalRef.value.style.left || modalRef.value.style.left.includes('-')) {
        modalState.left = 0;
      } else {
        modalState.left = modalRef.value.style.left;
      }

      if (!modalRef.value.style.top || modalRef.value.style.top.includes('-')) {
        modalState.top = 0;
      } else {
        modalState.top = modalRef.value.style.top;
      }

      modalState.width = modalRef.value.style.width;
      modalState.height = modalRef.value.style.height;
      //save to usersettings

      saveSettings(
        ['left', 'top', 'width', 'height'],
        [modalState.left, modalState.top, modalState.width, modalState.height]
      );
    };

    const closeModal = (eleRef: any, action: string) => {
      if (modalState.resolve) {
        eleRef.value && eleRef.value.classList.remove('show-modal');
        modalState.resolve(action);
      }

      if (modalState.resolve) {
        eleRef.value && eleRef.value.classList.remove('show-modal');
        modalState.resolve(action);
      }
    };

    const onResize = (event: any) => {
      if (modalRef.value) {
        modalState.width = modalRef.value.style.width;
        modalState.height = modalRef.value.style.height;
      }
    };

    const resizeObserver = new ResizeObserver(onResize);

    onMounted(() => {
      dragElement(modalRef.value);
      resizeObserver.observe(modalRef.value);
      loadSettings();
    });

    onUnmounted(() => {
      if (modalRef.value) {
        resizeObserver.unobserve(modalRef.value);
      }
    });

    return {
      modalState,
      dragElement,
      onMouseUp,
      closeModal,
      loadSettings,
      onResize
    };
  }
};
