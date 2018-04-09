/*
* @Author: Marte
* @Date:   2017-11-02 11:19:17
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-06 16:48:41
*/

$(function() {
    var ajaxs = [];
    var globalData = [];

    var renderCount = new RenderCount({
        minResposeTimeRender: $(".reslut-text .result-total ul li").eq(0).find(".response-time"),
        minAreaRender: $(".reslut-text .result-total ul li").eq(0).find(".result-tip"),
        maxResposeTimeRender: $(".reslut-text .result-total ul li").eq(1).find(".response-time"),
        maxAreaRender: $(".reslut-text .result-total ul li").eq(1).find(".result-tip"),
        linesRender: $(".reslut-text .result-total ul li").eq(2).find(".response-time"),
        averageRender: $(".reslut-text .result-total ul li").eq(3).find(".response-time"),
        tableRender: $(".result-ping-value table tbody")
    });


    $(".inputIp .input-group input").on("keydown",function(event) {
        // console.log(event.keyCode);
        if(event.keyCode==13) {
            $(".inputIp .input-group button").trigger("click");
        }
    });
    $(".inputIp .input-group button").click(function(event) {
        if($.trim($(".inputIp .input-group input").val())!="") {
            globalData = [];
            var cont = new Count(globalData);
            var option = {
        title : {
            text: '各地PING值',
            subtext: '腾正科技',
            x:'center',
            y: 18
        },
        tooltip : {
             // formatter: "地区：{b}<br/>时长：{c}ms<br/>"
             formatter: function(params,ticket,callback) {
                console.log(params);
                if(params[5].seriesIndex) {
                    return `地区：${params[1]}<br/>时长：${Math.ceil(params[5].value/params[5].seriesIndex.length)}ms<br/>`;
                }else {
                    return "-";
                }

             }
        },
        // legend: {
        //     orient: 'vertical',
        //     x:'left',
        //     data:['超时','100-5000ms','50-100ms','>50ms']
        // },
        dataRange: {
            min: 0,
            max: 5000,
            x: 'left',
            y: 'bottom',
            text:['慢','快'],           // 文本，默认为数值文本
            calculable : true,
             color: ['#E0022B', '#E09107', '#64CC6A']
        },
        series : [
            {
                name: '超时',
                type: 'map',
                mapType: 'china',
                roam: false,
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[
                ]
            },
            {
                name: '100-5000ms',
                type: 'map',
                mapType: 'china',
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[
                ]
            },
            {
                name: '50-100ms',
                type: 'map',
                mapType: 'china',
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[
                ]
            },
            {
                name: '>50ms',
                type: 'map',
                mapType: 'china',
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[
                ]
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('baiduMap'));
    // 为echarts对象加载数据
    myChart.setOption(option);
    var inintSeries = [
            {
                name: '超时',
                type: 'map',
                mapType: 'china',
                roam: false,
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[
                ]
            },
            {
                name: '100-5000ms',
                type: 'map',
                mapType: 'china',
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[
                ]
            },
            {
                name: '50-100ms',
                type: 'map',
                mapType: 'china',
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[
                ]
            },
            {
                name: '>50ms',
                type: 'map',
                mapType: 'china',
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                data:[
                ]
            }
        ];
            $(".loading").addClass('show').removeClass('hidden');
            $(".result").addClass('show').removeClass('hidden');
            ajaxs = [];
            $(".points table tbody").empty();
            $(".btn-group").addClass('hidden').removeClass('show');
            for(let i = 0;i<15;i++) {
               ajaxs.push(new Promise((resolve, reject)=>{
                    $.ajax("http://192.168.2.122/PingServer/pingServer?locationAddr="+$(".inputIp .input-group input").val()+"&count="+(i+1),{
                        complete: function(data) {
                            try {
                                console.log(data);
                                var result = JSON.parse(data.responseText);
                                $(".points table tbody").append(`
                                        <tr data-operator="${result.operator}">
                                            <td>${result.province}[${result.operator}]</td>
                                            <td>${result.resposeIp?result.resposeIp:"-"}</td>
                                            <td>${result.resposeLocation?result.resposeLocation:"-"}</td>
                                            <td><span>${result.resposeTime=="超时"?"<span style='color: #DA5858;'>"+result.resposeTime+"</span>":result.resposeTime}${result.resposeTime=="超时"?"":"ms"}</span></td>
                                            <td>${result.sponsor.name}</td>
                                        </tr>
                                    `);
                                globalData.push(result);
                                console.log(cont.result(),"line176");
                                renderCount.renderTotalResult(cont.result());
                                renderCount.renderAreaResult(cont.resultAreaTime());
                                renderCount.renderMap(cont.resultMapData(option,inintSeries),myChart);

                            }catch(e) {
                                console.log(e);
                            }
                            resolve({index: i,result: result});
                        }
                    });
               }));
            }
            Promise.all(ajaxs).then(function(values) {
                console.log(values);
                $(".loading").addClass('hidden').removeClass('show');

                for(var i = 0;i<4;i++) {
                    inintSeries[i].data = [];
                }
                // $(".result").addClass('show').removeClass('hidden');
                var totalSpeed = 0;
                var sortArr = [];
                values.forEach(function(e) {
                    if(e.result) {
                        sortArr.push(e);
                        totalSpeed+=parseInt(e.result.resposeTime);
                        // if(!e.result.echartData) {
                        //     e.result.echartData = {
                        //         value: e.result.resposeTime,
                        //         name: e.result.province
                        //     }
                        // }
                        // if(Number(e.result.resposeTime)<50) {

                        //     inintSeries[3].data.push(e.result.echartData);
                        // }else if(Number(e.result.resposeTime)>50&&Number(e.result.resposeTime)<100) {
                        //     inintSeries[2].data.push(e.result.echartData);
                        // }else if(Number(e.result.resposeTime)>100&&Number(e.result.resposeTime)<5000) {
                        //     inintSeries[1].data.push(e.result.echartData);
                        // }else if(e.result.resposeTime=="超时") {
                        //     e.result.echartData.value = 5000;
                        //     inintSeries[0].data.push(e.result.echartData);
                        // }
                    }
                });
                // console.log(inintSeries);
                // myChart.setSeries(inintSeries);
                sortArr.sort(function(a,b) {
                    if(a.result&&b.result) {
                        return a.result.resposeTime - b.result.resposeTime;
                    }

                });
                console.log(values);
                var total = 0;

                var telecommunications = 0;
                var mobile = 0;
                var china_unicom = 0;
                for(var i = 0;i<values.length;i++) {
                    if(values[i].result) {
                        total++;
                        switch(values[i].result.operator) {
                            case "移动":
                                mobile++;
                            break;
                            case "电信":
                                telecommunications++;
                            break;
                            case "联通":
                                china_unicom++;
                            break;
                        }
                    }
                }
                $(".btn-group").addClass('show');
                $(".btn-group span").eq(0).html("全部显示 ( "+total+" )");
                $(".btn-group span").eq(1).html("电信 ( "+telecommunications+" )");
                $(".btn-group span").eq(2).html("联通 ( "+china_unicom+" )");
                $(".btn-group span").eq(3).html("移动 ( "+mobile+" )");
                $(".btn-group span").click(function() {
                    $(this).addClass('active').siblings().removeClass('active');
                    if($(this).attr("data-operator")=="all") {
                        $(".points table tbody tr").show();
                    }else {
                        $(".points table tbody tr").hide();
                        $(".points table tbody tr[data-operator='"+$(this).attr("data-operator")+"']").show();
                    }

                });
                if(sortArr[0].result.resposeTime=="超时") {
                    $(".reslut-text .result-total ul li").eq(0).find(".response-time").html(sortArr[0].result.resposeTime);
                }else {
                    $(".reslut-text .result-total ul li").eq(0).find(".response-time").html(sortArr[0].result.resposeTime+"ms");
                }

                $(".reslut-text .result-total ul li").eq(0).find(".result-tip").html("最快 <a href='#'>"+sortArr[0].result.province+"["+sortArr[0].result.operator+"]</a>");
                if(sortArr[sortArr.length-1].result.resposeTime=="超时") {
                     $(".reslut-text .result-total ul li").eq(1).find(".response-time").html(sortArr[sortArr.length-1].result.resposeTime);
                }else {
                    $(".reslut-text .result-total ul li").eq(1).find(".response-time").html(sortArr[sortArr.length-1].result.resposeTime+"ms");
                }

                $(".reslut-text .result-total ul li").eq(1).find(".result-tip").html("最慢 <a href='#'>"+sortArr[sortArr.length-1].result.province+"["+sortArr[sortArr.length-1].result.operator+"]</a>");

                $(".reslut-text .result-total ul li").eq(2).find(".response-time").html(sortArr.length);
                console.log(totalSpeed);
                if(isNaN(Math.ceil(totalSpeed/sortArr.length))) {
                    $(".reslut-text .result-total ul li").eq(3).find(".response-time").html("-");
                }else {
                    $(".reslut-text .result-total ul li").eq(3).find(".response-time").html(Math.ceil(totalSpeed/sortArr.length)+"ms");
                }


                $(".result-ping-value table tbody").empty();

                for(var i = 0;i<Math.ceil(sortArr.length/4);i++) {
                    $(".result-ping-value table tbody").append("<tr></tr>");
                }
                for(var i = 0;i<sortArr.length;i++) {
                    console.log($(".result-ping-value table tbody tr").eq(Math.floor(i/4)));
                    $(".result-ping-value table tbody tr").eq(Math.floor(i/4)).append("<td>"+sortArr[i].result.province+sortArr[i].result.operator+'：<sapn style="color: '+(sortArr[i].result.resposeTime=="超时"?'#DA5858':'#56C98F')+';">'+sortArr[i].result.resposeTime+'</sapn></td>');
                }


            });
        }

    });

})