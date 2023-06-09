import { createApp } from 'vue'
import App from './App.vue'
import dayjs from 'dayjs'
import 'lib-flexible/flexible'
import router from './router'
import {
    Checkbox,
    CheckboxGroup,
    Sticky,
    Cascader,
    TreeSelect,
    SwipeCell,
    Popover,
    ActionSheet,
    Col,
    Row,
    Radio,
    RadioGroup,
    Circle,
    Uploader,
    Search,
    Image as VanImage,
    Grid,
    GridItem,
    Button,
    Tabbar,
    TabbarItem,
    Form,
    Field,
    Icon,
    NavBar,
    Cell,
    Popup,
    List,
    PullRefresh,
    DatetimePicker,
    NumberKeyboard,
    Dialog,
    Progress,
    Rate,
    Divider,
    CellGroup,
    Skeleton,
    Loading,
} from 'vant';
import 'vant/lib/index.css'; // 全局引入样式
import './index.css'

const app = createApp(App)

// 全局过滤器
app.config.globalProperties.$filters = {
    transTime(date) {
        return dayjs(Number(date)).format('HH:mm')
    },
    transDay(value) {
        return dayjs(value).format('MM-DD')
    },
    transYDM(value) {
        return dayjs(value).format('YYYY-MM-DD HH:mm')
    }
}

app.use(router)
app.use(Tabbar)
app.use(Cascader)
app.use(TabbarItem)
app.use(ActionSheet)
app.use(Uploader)
app.use(Sticky)
app.use(SwipeCell)
app.use(Circle)
app.use(Col)
app.use(Row)
app.use(Popover)
app.use(Dialog)
app.use(Form)
app.use(Field)
app.use(Button)
app.use(TreeSelect)
app.use(Icon)
app.use(NavBar)
app.use(CellGroup)
app.use(Cell)
app.use(RadioGroup)
app.use(Radio)
app.use(Popup)
app.use(List)
app.use(PullRefresh)
app.use(DatetimePicker)
app.use(NumberKeyboard)
app.use(Progress)
app.use(Rate)
app.use(Divider)
app.use(Search)
app.use(GridItem)
app.use(Grid)
app.use(VanImage)
app.use(CheckboxGroup)
app.use(Checkbox)
app.use(Skeleton)
app.use(Loading)
app.mount('#app')