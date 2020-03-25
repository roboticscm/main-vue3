<template>
  <div class="tree-wrapper">
    <slot name="label"></slot>
    <ul :id="props.id" class="tree ztree"></ul>
    <div v-if="!props.data || props.data.length === 0" class="no-data">
      <img src="../../assets/images/no-data-found.png" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { onUnmounted, watch } from 'vue';
import { Debug } from '@/assets/js/debug';

export default {
  setup(props: any, context: any) {
    if (!props.id) {
      Debug.errorSection('TreeView', 'Props.treeId is not set. Set props.treeId for TreeView please');
      return {};
    }

    let data: any[] = [];

    onUnmounted(() => {
      ($ as any).fn.zTree.destroy($('#' + props.id));
    });

    const setFontCss = (treeId, treeNode) => {
      const body = document.querySelector('body[class^="theme-"]');
      let hightlightColor = getComputedStyle(body as any)
        .getPropertyValue('--highlight-text-color')
        .trim();
      return treeNode.done === true ? { color: hightlightColor } : {};
    };

    watch(
      () => props.disabled,
      (disabled: boolean) => {
        setTimeout(() => {
          disableTree(disabled);
        }, 200);
      }
    );
    watch(
      () => props.data,
      (dt: any) => {
        data = dt;
        const setting = {
          check: {
            enable: props.isCheckableNode ? true : false
          },
          view: {
            fontCss: setFontCss
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            onClick: (event: any, treeId: any, treeNode: any) => {
              event.preventDefault();
              context.emit('click', { event, treeId, treeNode });
            }
          }
        };
        ($ as any).fn.zTree.init($('#' + props.id), setting, data);

        setTimeout(() => {
          disableTree(props.disabled ? props.disabled : false);
        }, 200);
      }
    );

    const selectNodeById = (id: any) => {
      var treeObj = ($ as any).fn.zTree.getZTreeObj(props.id);

      if (treeObj && id) {
        var nodes = treeObj.getNodesByParam('id', id, null);
        if (nodes && nodes.length > 0) {
          treeObj.selectNode(nodes[0]);
        }
      }
    };

    const getSelectedNode = () => {
      var treeObj = ($ as any).fn.zTree.getZTreeObj(props.id);

      let nodes = treeObj && treeObj.getSelectedNodes();

      if (nodes && nodes.length > 0) {
        return nodes[0];
      } else {
        return null;
      }
    };

    const getCheckedLeafIds = (checked: boolean) => {
      var treeObj = ($ as any).fn.zTree.getZTreeObj(props.id);
      let nodes = treeObj && treeObj.getCheckedNodes(checked);

      if (nodes && nodes.length > 0) {
        return nodes.filter((node: any) => !node.isParent).map((node: any) => node.id);
      } else {
        return [];
      }
    };

    const disableTree = (disable: boolean) => {
      const treeObj = ($ as any).fn.zTree.getZTreeObj(props.id);

      const rootNodes = treeObj && treeObj.getNodes();
      if (rootNodes) {
        const nodes = treeObj.transformToArray(rootNodes);
        for (let i = 0, l = nodes.length; i < l; i++) {
          treeObj.setChkDisabled(nodes[i], disable);
        }
      }
    };

    const cleanTree = () => {
      const treeObj = ($ as any).fn.zTree.getZTreeObj(props.id);

      const rootNodes = treeObj && treeObj.getNodes();
      if (rootNodes) {
        const nodes = treeObj.transformToArray(rootNodes);
        for (let i = 0, l = nodes.length; i < l; i++) {
          treeObj.removeNode(nodes[i]);
        }
      }
    };
    return {
      selectNodeById,
      disableTree,
      cleanTree,
      props,
      getSelectedNode,
      getCheckedLeafIds
    };
  }
};
</script>

<style lang="scss">
.tree {
  height: 100%;
  overflow: auto;
}

.tree-wrapper {
  display: left;
  justify-content: center;
  align-items: center;
}
.no-data {
  text-align: center;
}
</style>
