export default {
  load() {
    import('./css.attached.less').then(v => {
      v.use();

      setTimeout(function () {
        v.unuse();
      }, 3000);
    });
  }
}
