class RenderCount {
    constructor(config) {
        this.config = config;
    }
    renderTotalResult(data) {
        if(data.min=="超时") {
            this.config.minResposeTimeRender.html(data.min);
        }else {
             this.config.minResposeTimeRender.html(data.min+"ms");
        }
        this.config.minAreaRender.html("最快 <a href='#'>"+data.minArea+"["+data.minOperator+"]</a>");
        if(data.max=="超时") {
            this.config.maxResposeTimeRender.html(data.max);
        }else {
            this.config.maxResposeTimeRender.html(data.max+"ms");
        }
        this.config.maxAreaRender.html("最慢 <a href='#'>"+data.maxArea+"["+data.maxOperator+"]</a>");

        this.config.linesRender.html(data.lines);
        if(isNaN(data.average)) {
            this.config.averageRender.html("-");
        }else {
            this.config.averageRender.html(data.average+"ms");
        }

    }
    renderAreaResult(data) {
        this.config.tableRender.empty();
        for(var i = 0;i<Math.ceil(data.length/4);i++) {
            this.config.tableRender.append("<tr></tr>");
        }
        for(var i = 0;i<data.length;i++) {
            this.config.tableRender.find("tr").eq(Math.floor(i/4)).append("<td>"+data[i].key+'：<sapn style="color: '+(data[i].value=="超时"?'#DA5858':'#56C98F')+';">'+data[i].value+'</sapn></td>');
        }
    }
    renderMap(option,myChart) {
        myChart.setOption(option);
    }
}