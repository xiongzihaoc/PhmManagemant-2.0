// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  // ['blockquote', 'code-block'],
  //   [{
  //     'header': 1
  //   }, {
  //     'header': 2
  //   }],
  //   [{
  //     'list': 'ordered'
  //   }, {
  //     'list': 'bullet'
  //   }],
  //   [{
  //     'script': 'sub'
  //   }, {
  //     'script': 'super'
  //   }],
  [{
    'indent': '-1'
  }, {
    'indent': '+1'
  }],
  //   [{
  //     'direction': 'rtl'
  //   }],
  [{
    'size': ['small', false, 'large', 'huge']
  }],
  //   [{
  //     'header': [1, 2, 3, 4, 5, 6, false]
  //   }],
  [{
      'color': [],
      'border': []
    },
    // {'border':['1px solid #ccc']},
    {
      'background': []
    }
  ],
  //   [{
  //     'font': []
  //   }],
  [{
    'align': []
  }],
  [{
    'clean': '源码编辑'
  }],
  ['link', 'image'],
  ['sourceEditor', 'addBorder'] //新添加的工具
];

const handlers = {
  // shadeBox: null,
  // sourceEditor: function () {
  //   const reg = /\\>/,
  //     container = this.container,
  //     firstChild = container.nextElementSibling.firstChild;
  //   if (!this.shadeBox) {
  //     let shadeBox = this.shadeBox = document.createElement('div');
  //     shadeBox.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); cursor:pointer;';
  //     container.style = 'position:relative;'
  //     shadeBox.addEventListener('click', function () {
  //       this.style.display = 'none';
  //       firstChild.innerHTML = firstChild.innerText.trim();
  //     }, false);
  //     container.appendChild(shadeBox);
  //     let innerHTML = firstChild.innerHTML;
  //     innerHTML = innerHTML.replace(reg, '');
  //     firstChild.innerText = innerHTML;
  //   } else {

  //     let innerHTML = firstChild.innerHTML;
  //     innerHTML = innerHTML.replace(reg, '');
  //     firstChild.innerText = innerHTML;
  //     this.shadeBox.style.display = 'block';
  //   }
  // },
  // addBorder:function(){
  //   container = this.container,
  //   console.log(container);
    
  // }
};

export default {
  placeholder: '',
  theme: 'snow', // 主题
  modules: {
    toolbar: {
      container: toolOptions, // 工具栏选项
      handlers: handlers // 事件重写
    }
  },
  initButton: function () {
    const sourceEditorButton = document.querySelector('.ql-sourceEditor');
    sourceEditorButton.style.cssText = "width:80px; border:1px solid #ccc; border-radius:5px;";
    sourceEditorButton.innerText = "源码编辑";
  },
  borderButton: function () {
    const borderBtn = document.querySelector('.ql-addBorder');
    borderBtn.style.cssText = "width:80px; border:1px solid #ccc; border-radius:5px;margin-left:10px";
    borderBtn.innerText = "添加边框"
  },
  register(q) {
  
    //注册标签(因为在富文本编辑器中是没有div,table等标签的，需要自己去注册自己需要的标签)
    class div extends q.import('blots/block/embed') {}
    // class table extends q.import('blots/block/embed') {}
    // class tr extends q.import('blots/block/embed') {}
    // class td extends q.import('blots/block/embed') {}
    div.blotName = div.tagName = 'div';
    // table.blotName = table.tagName = 'table';
    // tr.blotName = tr.tagName = 'tr';
    // td.blotName = td.tagName = 'td';
    q.register(div);
    // q.register(table);
    // q.register(tr);
    // q.register(td);
  },
};