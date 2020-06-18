import Vue from 'vue'
import {
  Input,
  Form,
  FormItem,
  Button,
  Menu,
  Submenu,
  MenuItem,
  Aside,
  Main,
  Header,
  Card,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Dialog,
  Select,
  Option,
  Row,
  Col,
  Pagination,
  Tree,
  Upload,
  Cascader,
  Message,
  MessageBox,
  Backtop,
  Radio,
  Checkbox,
  CheckboxGroup,
  Icon,
  Loading,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Card)
Vue.use(Container)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Submenu)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Row)
Vue.use(Col)
Vue.use(Pagination)
Vue.use(Tree)
Vue.use(Upload)
Vue.use(Cascader)
Vue.use(Backtop)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Icon)
Vue.use(Loading)

// 全局弹框
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm;