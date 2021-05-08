<template>
  <div class="container">
    <header>头部</header>
    <main><slot name="main" :list="row" age="10"></slot></main>
    <footer><slot name="footer"></slot></footer>
  </div>
</template>

<script>
export default {
  name: 'MyTest',
  data () {
    return {
      row: [{ name: 'xxx' }, { name: 'yyy' }]
    }
  }
}
</script>

<style scoped lang='less'></style>
