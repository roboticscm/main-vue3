<template>
  <div class="template-wrapper">
    <progress-bar :loading="state.loading"></progress-bar>
    <div class="view-content-main">
      <div class="row">
        <div class="default-border  col-sm-24 col-md-8">
          <owner-org-tree-view ref="orgTreeViewRef" id="orgTreeView" @click="onOrgTreeClick" />
        </div>

        <div class="default-border col-sm-24 col-md-8  px-sm-0 px-md-1 py-sm-1 py-md-0">
          <user-list userListId="userListId" :orgId="state.orgId" @selectedRow="onSelectedUser" ref="userListRef" />
        </div>
        <div class="default-border col-sm-24 col-md-8 ">
          <role-grid ref="roleListRef" roleListId="roleListId" :orgId="state.orgId"></role-grid>
        </div>
      </div>
    </div>

    <div class="view-content-bottom">
      <reset-button
        id="btnReset"
        @click="onReset"
        :disabled="isDisabled('btnReset')"
        v-if="isRendered('btnReset')"
        :running="state.resetRunning"
      ></reset-button>
      <save-button
        id="btnSave"
        :disabled="isDisabled('btnSave')"
        @click="onSave"
        :running="state.saveRunning"
        v-if="isRendered('btnSave')"
      ></save-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, watch, inject } from 'vue';

import OwnerOrgTreeView from '@/components/owner-org/owner-org-tree-view/index.vue';
import UserList from '@/components/user-list/index.vue';
import RoleGrid from '@/components/role/role-grid/index.vue';

import { Debug } from '@/assets/js/debug';

export default {
  components: {
    OwnerOrgTreeView,
    UserList,
    RoleGrid
  },
  setup(props: any, context: any) {
    const { system } = inject('store');
    const userListRef = ref(null);
    const roleListRef = ref(null);
    const orgTreeViewRef = ref(null);
    const state = reactive({
      orgId: null,
      loading: false,
      resetRunning: false,
      saveRunning: false
    });
    const useView = props.useView;
    const onOrgTreeClick = (event: any) => {
      if (event.treeNode && event.treeNode.id) {
        doSelectTreeNode(event.treeNode.id);
      }
    };
    const doSelectTreeNode = async (ordId: any) => {
      state.loading = true;
      let userListPromise = userListRef.value.loadData(ordId);
      let roleListPromise = roleListRef.value.loadData(ordId);
      await Promise.all([userListPromise, roleListPromise]).then((_) => {
        state.loading = false;
      });
    };
    const onSave = () => {
      let selectedUsers = userListRef.value.getSelectedUsers();
      if (!selectedUsers || selectedUsers.length == 0) {
        Debug.logSection('sys/amr/main/index.vue', 'You must select user');
        return;
      }
      state.saveRunning = true;
      system.assignmentRoleStore
        .saveOrUpdateOrDelete(selectedUsers, roleListRef.value.getData())
        .then((res: any) => {
          context.emit('loadWorkList', {
            ...selectedUsers[0],
            createdDate: new Date()
          });
          state.saveRunning = false;
        })
        .catch((error: any) => {
          console.error(error);
          state.saveRunning = false;
        });
    };
    const onReset = () => {
      state.resetRunning = true;
      userListRef.value.unSelectAll();
      setTimeout(() => {
        state.resetRunning = false;
      }, 100);
    };
    watch(
      () => props.selectedUser,
      async (selectedUser: any) => {
        if (selectedUser && selectedUser.length > 0) {
          orgTreeViewRef.value.selectNodeById(selectedUser[0].defaultOwnerOrgId);
          await doSelectTreeNode(selectedUser[0].defaultOwnerOrgId);
          userListRef.value.selectRowById(selectedUser[0].id);
        }
      }
    );
    const onSelectedUser = (event: any) => {
      let selectedUsers = event;
      if (selectedUsers.length == 1 && selectedUsers[0]) {
        state.loading = true;
        system.assignmentRoleStore
          .sysGetRoleListOfUser(selectedUsers[0].id)
          .then((assignmentRoles: any) => {
            if (assignmentRoles) {
              roleListRef.value.applyAssignedRole(assignmentRoles);
            } else {
              roleListRef.value.applyAssignedRole([]);
            }
            state.loading = false;
          })
          .catch((error: any) => {
            roleListRef.value.applyAssignedRole([]);
            state.loading = false;
            console.error(error);
          });
      } else {
        roleListRef.value.applyAssignedRole([]);
      }
    };

    return {
      onOrgTreeClick,
      state,
      onSave,
      onReset,
      props,
      onSelectedUser,
      userListRef,
      orgTreeViewRef,
      roleListRef,
      ...useView
    };
  }
};
</script>

<style lang="scss" scoped></style>
