import * as echarts from "echarts/core"

import {
  BarChart,
  BarSeriesOption,
  LineChart,
  LineSeriesOption,
  PieChart,
  PieSeriesOption
} from "echarts/charts"

import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  DatasetComponent,
  DatasetComponentOption,
  TransformComponent,
  LegendComponent,
  ToolboxComponent
} from "echarts/components"

import {LabelLayout, UniversalTransition} from "echarts/features"
import {CanvasRenderer} from "echarts/renderers"

export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | PieSeriesOption
>

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])

export default echarts
