
<template>
  <div class="header" style="font-size: 0.6rem">
    <van-icon name="arrow-left" style="margin-top: 0.4rem" @click="BackF" />
  </div>
  <div class="data">
    <div class="total">
      <div class="time" @click="monthToggle">
        <span>{{ currentMonth }}</span>
        <van-icon name="notes-o" />
      </div>
      <div class="title">共支出</div>
      <div class="expense">¥{{ total_expense || 0 }}</div>
      <div class="income">共收入¥{{ total_income || 0 }}</div>
    </div>
    <div class="structure">
      <div class="head">
        <span class="title">月份收支</span>
        <div class="tab">
          <span
            @click="changeTotalType('expense')"
            class="expense"
            :class="{ active: totalType == 'expense' }"
            >支出</span
          >
          <span
            @click="changeTotalType('income')"
            class="income"
            :class="{ active: totalType == 'income' }"
            >收入</span
          >
        </div>
      </div>
      <div class="content">
        <div id="series" style="width: 351px; height: 500px"></div>
      </div>
    </div>
    <div class="proportion">
      <div class="head">
        <span class="title">收支构成</span>
        <div class="tab">
          <span
            @click="changePieType('expense')"
            class="expense"
            :class="{ active: pieType == 'expense' }"
            >支出</span
          >
          <span
            @click="changePieType('income')"
            class="income"
            :class="{ active: pieType == 'income' }"
            >收入</span
          >
        </div>
      </div>
      <div id="proportion"></div>
      <div id="main" style="width: 600px; height: 400px"></div>
    </div>
    <PopMonth ref="popMonthRef" @select="selectMonth" />
  </div>
</template>


<script>
import { ref, onMounted, reactive, toRefs, onUnmounted } from "vue";
import dayjs from "dayjs";
import PopMonth from "../components/PopMonth.vue";
import axios from "../utils/axios";
import { typeMap } from "../utils";
import { Toast } from "vant";
import router from "../router";

let proportionChart = null;
let proportionSeries = null;
export default {
  name: "Data",
  components: {
    PopMonth,
  },
  setup() {
    const popMonthRef = ref(null);
    const state = reactive({
      typeMap,
      currentMonth: dayjs().format("YYYY-MM"),
      total_expense: 0,
      expense1: 0,
      expense2: 0,
      expense3: 0,
      expense4: 0,
      expense5: 0,
      expense6: 0,
      expense7: 0,
      expense8: 0,
      expense9: 0,
      expense10: 0,
      total_income: 0,
      income1: 0,
      income2: 0,
      income3: 0,
      income4: 0,
      income5: 0,
      income6: 0,
      income7: 0,
      income8: 0,
      expense_data: [],
      income_data: [],
      totalType: "expense",
      pieType: "expense",


      //前几月的支出
    });
    onMounted(() => {
      getData();
      getIncome();
      setPieChart();
      setChart2();
    });
    onUnmounted(() => {
      // 每次组件卸载的时候，需要释放图表实例。clear 只是将其清空不会释放。
      proportionChart.dispose();
    });    
    const getData = async () => {
      const params0 = {
        ledgerid: parseInt(localStorage.getItem("LedgerId")),
        starttime: dayjs(state.currentMonth)
          .startOf("month")
          .format("YYYY-MM-DD HH:mm:ss"),
        endtime: dayjs(state.currentMonth)
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss"),
        minamount: 0,
        maxamount: Number.MAX_VALUE,
        cost_type: [],
      };
      const data = await axios.post(
        "/HNBC/bill/selectbyconditionbyupdatetime",
        params0
      );
      if (data.state == "200") {
        var in_array_len = JSON.stringify(data.data).split("billid").length - 1;
        for (var i = 0; i < in_array_len; i += 1) {
          state.expense_data.push(data.data[i].cost);
          if (
            JSON.stringify(data.data[i].cost_type).indexOf("食品和饮料") != -1
          ) {
            state.expense1 =
              state.expense1 + parseFloat(JSON.stringify(data.data[i].cost));
          } else if (
            JSON.stringify(data.data[i].cost_type).indexOf("服装和个人用品") !=
            -1
          ) {
            state.expense2 =
              state.expense2 + parseFloat(JSON.stringify(data.data[i].cost));
          } else if (
            JSON.stringify(data.data[i].cost_type).indexOf("住房和家居") != -1
          ) {
            state.expense3 =
              state.expense3 + parseFloat(JSON.stringify(data.data[i].cost));
          } else if (
            JSON.stringify(data.data[i].cost_type).indexOf("交通和通讯") != -1
          ) {
            state.expense4 =
              state.expense4 + parseFloat(JSON.stringify(data.data[i].cost));
          } else if (
            JSON.stringify(data.data[i].cost_type).indexOf("娱乐和文化") != -1
          ) {
            state.expense5 =
              state.expense5 + parseFloat(JSON.stringify(data.data[i].cost));
          } else if (
            JSON.stringify(data.data[i].cost_type).indexOf("医疗保健") != -1
          ) {
            state.expense6 =
              state.expense6 + parseFloat(JSON.stringify(data.data[i].cost));
          } else if (
            JSON.stringify(data.data[i].cost_type).indexOf("教育和培训") != -1
          ) {
            state.expense7 =
              state.expense7 + parseFloat(JSON.stringify(data.data[i].cost));
          } else if (
            JSON.stringify(data.data[i].cost_type).indexOf("日常用品") != -1
          ) {
            state.expense8 =
              state.expense8 + parseFloat(JSON.stringify(data.data[i].cost));
          } else if (
            JSON.stringify(data.data[i].cost_type).indexOf("金融和投资") != -1
          ) {
            state.expense9 =
              state.expense9 + parseFloat(JSON.stringify(data.data[i].cost));
          } else if (
            JSON.stringify(data.data[i].cost_type).indexOf("其他支出") != -1
          ) {
            state.expense10 =
              state.expense10 + parseFloat(JSON.stringify(data.data[i].cost));
          }
        }

        state.total_expense =
          state.expense1 +
          state.expense2 +
          state.expense3 +
          state.expense4 +
          state.expense5 +
          state.expense6 +
          state.expense7 +
          state.expense8 +
          state.expense9 +
          state.expense10;
          console.log(state.expense_data);
      } else {
        console.log(data.msg);
      }

      const params1 = {};
    };
    const getIncome = async () => {
      const params = {
        ledgerid: parseInt(localStorage.getItem("LedgerId")),
        starttime: dayjs(state.currentMonth)
          .startOf("month")
          .format("YYYY-MM-DD HH:mm:ss"),
        endtime: dayjs(state.currentMonth)
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss"),
        minamount: 0,
        maxamount: Number.MAX_VALUE,
        earning_type: [],
      };
      const data = await axios.post(
        "/HNBC/income/selectbyconditionbyupdatetime",
        params
      );
      if (data.state == "200") {
        var in_array_len1 =
          JSON.stringify(data.data).split("incomeid").length - 1;          
        for (var i = 0; i < in_array_len1; i += 1) {
          if (
            JSON.stringify(data.data[i].earning_type).indexOf("工资收入") != -1
          ) {
            state.income1 =
              state.income1 + parseFloat(JSON.stringify(data.data[i].earning));
          } else if (
            JSON.stringify(data.data[i].earning_type).indexOf("业务收入") != -1
          ) {
            state.income2 =
              state.income2 + parseFloat(JSON.stringify(data.data[i].earning));
          } else if (
            JSON.stringify(data.data[i].earning_type).indexOf("投资收益") != -1
          ) {
            state.income3 =
              state.income3 + parseFloat(JSON.stringify(data.data[i].earning));
          } else if (
            JSON.stringify(data.data[i].earning_type).indexOf("房产租金") != -1
          ) {
            state.income4 =
              state.income4 + parseFloat(JSON.stringify(data.data[i].earning));
          } else if (
            JSON.stringify(data.data[i].earning_type).indexOf("兼职收入") != -1
          ) {
            state.income5 =
              state.income5 + parseFloat(JSON.stringify(data.data[i].earning));
          } else if (
            JSON.stringify(data.data[i].earning_type).indexOf("社交收入") != -1
          ) {
            state.income6 =
              state.income6 + parseFloat(JSON.stringify(data.data[i].earning));
          } else if (
            JSON.stringify(data2.data[i].earning_type).indexOf("奖金收入") != -1
          ) {
            state.income7 =
              state.income7 + parseFloat(JSON.stringify(data.data[i].earning));
          } else if (
            JSON.stringify(data2.data[i].earning_type).indexOf("其他收入") != -1
          ) {
            state.income8 =
              state.income8 + parseFloat(JSON.stringify(data.data[i].earning));
          }
        }
        state.total_income =
          state.income1 +
          state.income2 +
          state.income3 +
          state.income4 +
          state.income5 +
          state.income6 +
          state.income7 +
          state.income8;
          console.log(state.income_data);
      } else {
        console.log(data.msg);
      }
    };
    const BackF = () => {
      const Id = localStorage.getItem("LedgerId");
      router.push({ path: `/home?id=${Id}` });
    };
    // 切换收支构成类型
    const changeTotalType = (type) => {
      state.totalType = type;
    };
    // 切换饼图收支类型
    const changePieType = (type) => {
      state.pieType = type;
      // 重绘饼图
      setPieChart();
    };

    // 绘制饼图方法
    const setPieChart = () => {
      if (window.echarts) {
        proportionChart = echarts.init(document.getElementById("proportion"));
        if (state.pieType == "expense") {
          proportionChart.setOption({
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            series: [
              {
                name: "支出",
                type: "pie",
                radius: "55%",
                data: [
                  { value: state.expense1, name: "食品和饮料" },
                  { value: state.expense2, name: "服装和个人用品" },
                  { value: state.expense3, name: "住房和家居" },
                  { value: state.expense4, name: "交通和通讯" },
                  { value: state.expense5, name: "娱乐和文化" },
                  { value: state.expense6, name: "医疗保健" },
                  { value: state.expense7, name: "教育和培训" },
                  { value: state.expense8, name: "日常用品" },
                  { value: state.expense9, name: "金融和投资" },
                  { value: state.expense10, name: "其他支出" },
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            ],
          });
        } else {
          proportionChart.setOption({
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            // 图例
            // legend: {
            //   data: _data.map((item) => item.cost_type),
            // },
            series: [
              {
                name: "支出",
                type: "pie",
                radius: "55%",
                data: [
                  { value: 1048, name: "工资收入" },
                  { value: 0, name: "业务收入" },
                  { value: 580, name: "投资收益" },
                  { value: 484, name: "房产租金" },
                  { value: 300, name: "兼职收入" },
                  { value: 580, name: "社交收入" },
                  { value: 484, name: "奖金收入" },
                  { value: 300, name: "其他收入" },
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            ],
          });
        }
      }
    };
    //绘制柱状图
    const setChart2 = () => {
      if (window.echarts) {
        proportionSeries = echarts.init(document.getElementById("series"));
        proportionSeries.setOption({
          title: {
            text: "当月支出",
          },

          tooltip: {
            trigger: "axis",
          },

          legend: {
            data: ["消费金额", "收入金额"],
          },

          toolbox: {
            show: true,

            feature: {
              mark: { show: true },

              dataView: { show: true, readOnly: false },

              magicType: { show: true, type: ["line", "bar"] },

              restore: { show: true },

              saveAsImage: { show: true },
            },
          },

          calculable: true,

          xAxis: [
            {
              type: "category",
              data: [
                "1月",
                "2月",
                "3月",
                "4月",
                "5月",
                "6月",
                "7月",
                "8月",
                "9月",
                "10月",
                "11月",
                "12月",
              ],
            },
          ],

          yAxis: [
            {
              type: "value",
            },
          ],

          series: [
            {
              name: "消费金额",
              type: "bar",
              data: [
                2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4,
                3.3,
              ],
              markPoint: {
                data: [
                  { type: "max", name: "最大值" },

                  { type: "min", name: "最小值" },
                ],
              },
              markLine: {
                data: [{ type: "average", name: "平均值" }],
              },
            },
            {
              name: "收入金额",
              type: "bar",
              data: [
                2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0,
                2.3,
              ],
              markPoint: {
                data: [
                  {
                    name: "年最高",
                    value: 182.2,
                    xAxis: 7,
                    yAxis: 183,
                    symbolSize: 18,
                  },

                  { name: "年最低", value: 2.3, xAxis: 11, yAxis: 3 },
                ],
              },

              markLine: {
                data: [{ type: "average", name: "平均值" }],
              },
            },
          ],
        });
      }
    };

    // 月份弹窗开关
    const monthToggle = () => {
      popMonthRef.value.toggle();
    };

    const selectMonth = (item) => {
      state.currentMonth = item;
      state.currentMonth1 = dayjs(currentMonth).add(-1, "month");
      state.currentMonth2 = dayjs(currentMonth).add(-2, "month");
      state.currentMonth3 = dayjs(currentMonth).add(-3, "month");
      state.currentMonth4 = dayjs(currentMonth).add(-4, "month");
      getData();
    };
    //计算对象数组中某个属性合计
    function countTotal(arr, keyName) {
      let $total = 0;
      $total = arr.reduce(function (total, currentValue, currentIndex, arr) {
        return currentValue[keyName] ? total + currentValue[keyName] : total;
      }, 0);
      return $total;
    }
    return {
      ...toRefs(state),
      popMonthRef,
      selectMonth,
      monthToggle,
      changeTotalType,
      changePieType,
      setPieChart,
      BackF,
      getIncome,
      getData,
      setChart2,
    };
  },
};
</script>

<style lang='less' scoped>
@import url("../config/custom.less");
.data {
  min-height: 100%;
  background-color: #f5f5f5;
  .total {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
    margin-bottom: 10px;
    .time {
      position: relative;
      width: 96px;
      padding: 6px;
      background-color: #f5f5f5;
      color: @color-text-base;
      border-radius: 4px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      span:nth-of-type(1)::after {
        content: "";
        position: absolute;
        top: 9px;
        bottom: 8px;
        right: 28px;
        width: 1px;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .van-icon-notes-o {
        font-size: 16px;
        color: @color-text-caption;
      }
    }
    .title {
      color: @primary;
      margin-bottom: 8px;
      font-size: 12px;
      font-weight: 500;
    }
    .expense {
      font-size: 24px;
      color: @primary;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .income {
      color: @color-text-caption;
      font-weight: 500;
    }
  }
  .structure {
    padding: 0 16px;
    background-color: #fff;
    margin-bottom: 10px;
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      .title {
        font-size: 18px;
        color: @color-text-base;
      }
      .tab {
        span {
          display: inline-block;
          width: 40px;
          height: 24px;
          background-color: #f5f5f5;
          text-align: center;
          line-height: 24px;
          margin-left: 10px;
          border-radius: 4px;
        }
        .expense {
          &.active {
            background-color: rgba(57, 190, 119, 0.2);
            color: @primary;
          }
        }
        .income {
          &.active {
            background-color: rgba(236, 190, 37, 0.2);
            color: @text-warning;
          }
        }
      }
    }
    .content {
      .item {
        display: flex;
        height: 50px;
        align-items: center;
        .left {
          flex: 4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-right: 10px;
          .type {
            display: flex;
            align-items: center;
            span:nth-of-type(1) {
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              margin-right: 10px;
              color: #fff;
            }
            .expense {
              background-color: @primary;
            }
            .income {
              background-color: @text-warning;
            }
          }
        }
        .right {
          flex: 8;
          display: flex;
          align-items: center;
          .percent {
            width: 160px;
          }
          .momey {
            width: 100px;
          }
        }
      }
    }
  }
  .proportion {
    background-color: #fff;
    padding: 12px;
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      .title {
        font-size: 18px;
        color: @color-text-base;
      }
      .tab {
        span {
          display: inline-block;
          width: 40px;
          height: 24px;
          background-color: #f5f5f5;
          text-align: center;
          line-height: 24px;
          margin-left: 10px;
          border-radius: 4px;
        }
        .expense {
          &.active {
            background-color: rgba(57, 190, 119, 0.2);
            color: @primary;
          }
        }
        .income {
          &.active {
            background-color: rgba(236, 190, 37, 0.2);
            color: @text-warning;
          }
        }
      }
    }
    #proportion {
      width: 100%;
      height: 400px;
    }
  }
}
</style>