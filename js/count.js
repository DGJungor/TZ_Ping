/**
 * data对象
 * locationAddr:"四川电信"
locationIp:"182.140.221.24"
operator:"电信"
province:"四川"
resposeIp:"123.125.114.144"
resposeLocation:"中国华北北京市北京市联通"
resposeTime:"47"
sponsor:{name: "腾正科技", Url: "www.tzidc.com"}
ttl:"52"
 */
class Count {
    constructor(data) {
        if(!data&&Object.prototype.toString.call(data).indexOf("object Array")!=-1) {
            throw("不能没有data传入且data必须是数组");
        }
        this.data = data;
    }

    result() {
        console.log(this.data);
        var total = 0;
        this.data.sort(function(a,b) {
            return a.resposeTime - b.resposeTime;
        });
        this.data.forEach(function(e) {
            if(e.resposeTime!="超时") {
                total+=Number(e.resposeTime);
            }
        });
        return {
            min: this.data[0].resposeTime,
            max: this.data[this.data.length-1].resposeTime,
            minArea: this.data[0].locationAddr,
            maxArea: this.data[this.data.length-1].locationAddr,
            minOperator: this.data[0].operator,
            maxOperator: this.data[this.data.length-1].operator,
            lines: this.data.length,
            average: Math.ceil(total/this.data.length)
        }
    }

    resultAreaTime() {
        var result = [];
        this.data.forEach(function(e) {
            if(e) {
              result.push({
                    key: e.province+e.operator,
                    value: e.resposeTime
                });
            }

        });
        return result;
    }
    resultMapData(option,inintSeries) {
        this.data.forEach(function(e) {
            if(!e.echartData) {
                e.echartData = {
                    value: e.resposeTime,
                    name: e.province
                }
            }
            if(Number(e.resposeTime)<50) {

                inintSeries[3].data.push(e.echartData);
            }else if(Number(e.resposeTime)>50&&Number(e.resposeTime)<100) {
                inintSeries[2].data.push(e.result.echartData);
            }else if(Number(e.resposeTime)>100&&Number(e.resposeTime)<5000) {
                inintSeries[1].data.push(e.echartData);
            }else if(e.resposeTime=="超时") {
                e.echartData.value = 5000;
                inintSeries[0].data.push(e.echartData);
            }
        });
        option.series = inintSeries;
        return option;
    }
}