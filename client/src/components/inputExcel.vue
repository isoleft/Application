<template>
  <span>
    <input class="input-file" type="file" @change="exportData"  
    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
    <div class="action-button">
    <button class="btn btn-block btn-primary" style="width: 200px;" @click="load()">Загрузить нагрузку</button>
    </div>
  </span>
</template>

<script>

import XLSX from 'xlsx'

export default {
	name: "inputExcel",
	methods: {
		load () {
      	document.querySelector(".input-file").click();
    	},
    	exportData (event) {
        if (!event.currentTarget.files.length) { 
          return;
        }
        const that = this;
        var f = event.currentTarget.files[0];
        var reader = new FileReader();
        FileReader.prototype.readAsBinaryString = function(f) {
          var binary = "";
          var wb;
          var outdata
          var reader = new FileReader();
          reader.onload = function(e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            wb = XLSX.read(binary, {
              type: "binary"
            });
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); 

            outdata = JSON.parse(JSON.stringify(outdata).split('"АВТОМАТИЗИРОВАННЫХ СИСТЕМ УПРАВЛЕНИЯ":').join('"eduload_form":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"Объем учебной работы кафедры:":').join('"eduload_code":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_1":').join('"eduload_name":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY":').join('"eduload_type":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_13":').join('"eduload_group":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_14":').join('"eduload_students":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_15":').join('"eduload_semestr":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_16":').join('"eduload_lec":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_17":').join('"eduload_lab":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_18":').join('"eduload_pr":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_19":').join('"eduload_ekz":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_20":').join('"eduload_zach":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_21":').join('"eduload_srs":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_22":').join('"eduload_prac":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_23":').join('"eduload_dip":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_24":').join('"eduload_gak":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_25":').join('"eduload_sum":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_26":').join('"eduload_idz":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_27":').join('"eduload_plec":'));
            outdata = JSON.parse(JSON.stringify(outdata).split('"__EMPTY_28":').join('"eduload_ppr":'));
            that.$emit("getResult", outdata);
          };
          reader.readAsArrayBuffer(f);
        };
        reader.readAsBinaryString(f);
    	}
	}
}
</script>

<style scoped>
.input-file {
  display: none;
}
.action-button {
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
