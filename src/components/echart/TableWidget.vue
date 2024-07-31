<template>
  <div :style="myStyle">
    <div id="theGrid" :style="gridStyle"></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
//import eventBus from 'vue3-eventbus'
//  vue-grid-item vue-resizable cssTransforms l-item

export default defineComponent({
  props: {
    id: {
      type: String,
      default: 'default_id'
    },
    styleObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    myStyle() {
      return {
        weight: this.styleObj.weight,
        height: this.styleObj.height,
        padding: '10px',
        'padding-top': '30px',
      }
    },
    gridStyle() {
      return {
        weight: '50%',
        height: `calc(100%)`,
      }
    }
  },
  data() {
    return {
      grid: null,
    }
  },
  mounted() {
    document.readyState === 'complete' ? this.init() : window.onload = this.init;
  },
  methods: {
    init() {
      this.grid = new wijmo.grid.FlexGrid('#theGrid', {
        showMarquee: true,
        selectionMode: 'MultiRange',
        alternatingRowStep: 0,
        autoGenerateColumns: false,
        columns: [
          { 
            header: 'ID', 
            binding: 'id', 
            width: 80, 
            isReadOnly: true 
          },
          {
            header: 'num', 
            binding: 'num',
            editor: new wijmo.input.InputNumber(document.createElement('div'), {
              value: 10, // 초기 값 설정
              min: 0, // 최소값 설정
              max: 100, // 최대값 설정
              format: 'n0' // 숫자 형식 지정 (예: 소수점 이하 자릿수)
            })
          },
          {
            header: 'date', 
            binding: 'date',
            editor: new wijmo.input.InputMask(document.createElement('div'), {
              mask: '0000/00/00', // 날짜 형식을 위한 마스크
              promptChar: '_'
            })
          },
          {
            header: 'Country', binding: 'country',
            editor: new wijmo.input.ComboBox(document.createElement('div'), {
              itemsSource: this.getCountries(),
              isEditable: false,
            })
          }
        ],
        itemsSource: this.getData()
      });
      if (!this.grid) return;
      let grid = this.grid;

      //grid.keyActionEnter = wijmo.grid.KeyAction.MoveRight;
      //grid.keyActionEnter = true ? wijmo.grid.KeyAction.CycleEditable : KeyAction.Cycle;
      grid.keyActionEnter = wijmo.grid.KeyAction.None;  //  Cycle, CycleEditable, CycleOut, MoveAcross, MoveDown, None
      grid._isEditing = false;

      grid.selectionChanging.addHandler(function(s, e) {
          var oldRow = s.selection.row;
          var oldCol = s.selection.col;
          var newRow = e.row;
          var newCol = e.col;
          //grid.finishEditing(true, oldRow, oldCol);
          setTimeout(() => {
            //grid.finishEditing(true, oldRow, oldCol);
            //grid.startEditing(true, newRow, newCol);
          }, 1)
      });

      grid.cellEditEnding.addHandler(function(e) {
        /*
          console.log('Cell is in editing state');
          var cell = grid.activeEditor;
          if (cell) {
              console.log('Cell is in editing state');
          } else {
              console.log('Cell is not in editing state');
          }
          */
      });
      grid.cellEditEnded.addHandler(function(e) {
          console.log('END Edit');
          //grid._isEditing = false;
      });

      grid.beginningEdit.addHandler(function(s, e) {
        console.log('BEGIN Edit Event Triggered');
        grid._isEditing = true;

        //if (e.col == 3) {
          //grid.toggleDropDownList();
          //grid.columns[3].editor.isDroppedDown = true;  
          //e.cancel = true
        //}
      });
      
      grid.hostElement.addEventListener('keydown', (e) => {
        console.log(grid._isEditing)
        //e.preventDefault();
        if (e.code == "Enter") {
          if (grid._isEditing) {
            setTimeout(() => {
              grid.finishEditing();
              grid._isEditing = false;
            }, 1)
          } else {
            setTimeout(() => {
              var cell = grid.selection;
              grid.startEditing(true, cell.row, cell.col);
            }, 1)  
          }
        }
      })

      grid.columns[2].editor.hostElement.addEventListener("keydown", function(e, s) {
        if (event.code === "Space") {
          e.preventDefault();
          e.target.select();

          //grid.columns[2].editor.select(); // Select all text in the input field
          console.log(e, s, grid.columns[2].editor)
        }
      });
      
      grid.onGotFocus = function() {
        var sel = grid.selection;
        //  한번만 실행됨
      };

      // 편집기에 keydown 이벤트를 추가하고, 기본 동작(키 입력)이 발생하지 않도록 설정합니다.
      grid.columns[3].editor.hostElement.addEventListener('keydown', (e) => {
        //console.log(e, grid.columns[3].editor)
        //e.preventDefault();
        if (e.code == "Space") {
          //e.preventDefault();
          //console.log('open')
          //grid.columns[3].editor.isDroppedDown = true;  
          //grid.columns[3].editor.isTouching = true;  
        }

        if (e.keyCode == 32) {
          e.preventDefault();
          //grid.toggleDropDownList();
          grid.columns[3].editor.isDroppedDown = true;  
        }
      },true);

    },
    getData(cnt = 100) {
      var data = [], countries = this.getCountries();
      for (var i = 0; i < cnt; i++) {
        data.push({
          id: i,
          num: Math.floor(Math.random() * 100),
          date: null,
          country: this.pickOne(countries),
        });
      }
      return data;
    },
    getCountries() {
      return 'US,Germany,UK,Japan,Italy,Greece'.split(',');
    },
    pickOne(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    
  }
});
</script>

<style scoped>
.widget-wrapper {
  width: 180px;
  height: 100px;
  background-color: lightblue;
  text-align: center;
  margin: 10px;
  cursor: move;
}
</style>