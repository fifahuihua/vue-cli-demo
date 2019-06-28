<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  mounted: async function() {
    await this.checkSession();

    if (!this.loginUser || !this.loginUser.id) {
      this.$router.push('/login');
    }
  },
  computed: {
    ...mapState(['loginUser'])
  },
  methods: {
    ...mapActions(['checkSession'])
  },
  watch: {
    loginUser: function(newValue) {
      if (newValue && newValue.id) {
        // this.$router.push('/');
      }
    }
  }
};
</script>
