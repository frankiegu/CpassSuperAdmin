
export default {
  methods: {
    renderQuillData() {
      // 1. 替换动态数据，拿到DOM，替换进入
      // 2. 拿到id，调用接口，生成数据；拿到插入的位置，重新插入
      // 3. 插入隐藏blot储存数据，然后进行替换
      // 怎么拿？怎么插？

      console.log('getElementsByClassName', document.getElementsByClassName('title-brand'));

      // document.getElementsByClassName('title-brand')[0].dataset.id = 1001
      document.getElementsByClassName('title-brand')[0].innerHTML = `<div class="title-name">
        <div class="name">国际空间站是的方式</div><div class="num">共61个门店</div>
      </div>`

      setTimeout(_ => {
        this.quillLoading = false
      }, 1000)
    }
  }
}
