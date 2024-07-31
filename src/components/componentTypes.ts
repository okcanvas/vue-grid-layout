import {Layout, LayoutItem} from "vue3-grid-layout-next/dist/helpers/utils"

export interface componentAttr extends LayoutItem {
  // label: string
  // propValue: string
  // icon: string
  animations?: Array<string>
  events?: {[key: string]: any}
  id?: string
}

export interface ChartType extends componentAttr {
  readonly component: "LineChart"
}

export interface FormType extends componentAttr {
  readonly component: "ButtonComponent"
  text?: string
}

export type ComponentType = ChartType | FormType
