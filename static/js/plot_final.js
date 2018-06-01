function init() {
    plot_sample_pie("BB_940") 
    plot_sample_bubble("BB_940")
  }

base_url = "http://127.0.0.1:5000";


window.onload = function () {
    url = base_url + "/names"
    Plotly.d3.json(url, function (error, response) {
        console.log(response)

        d3.select("#dropdown-menu")
            .selectAll("option")
            .data(response)
            .enter()
            .append("option")
            .text(function (d) { return d; })
            .attr("class", "text-center");
    });
}

function optionChanged(sample) {
    select_sample_metadata(sample)
    plot_sample_pie(sample) 
    plot_sample_bubble(sample)
}

function select_sample_metadata(sample) {

    url = base_url + "/metadata/" + sample
    
    Plotly.d3.json(url, function (error, response) {
        
        console.log(response)

        metadata_list = []
        metadata_list.push("Age: " + response[0]["AGE"])
        metadata_list.push("Type: " + response[0]["BBTYPE"])
        metadata_list.push("Ethnicity: " + response[0]["ETHNICITY"])
        metadata_list.push("Gender: " + response[0]["GENDER"])
        metadata_list.push("Location: " + response[0]["LOCATION"])
        metadata_list.push("Sample ID: " + response[0]["SAMPLEID"])

        d3.selectAll(".list-group")
            .selectAll("li")
            .data(metadata_list)
            .text(function (d) { return d; })
    }
    )
} 

function plot_sample_bubble(sample) {

    url = base_url + "/samples/" + sample

    console.log(url)
    
    Plotly.d3.json(url, function (error, response) {

        var trace1 = {
            x: response[0]["otu_ids"],
            y: response[0]["sample_values"],
            mode: 'markers',
            marker: {
                size: response[0]["sample_values"]
            }
        };

        var data = [trace1];

        var layout = {
            showlegend: false,
            xaxis: { title: 'Operational Taxonomic Unit', range: [0, 3675] },
            yaxis: { title: 'Values' },
            autosize: false,
            height: 500,
            width:  1000
        };

        Plotly.newPlot('bubble_chart', data, layout);
    });
}

function plot_sample_pie(sample) {

    url = base_url + "/samples/" + sample
    
    d3.json(url, function (error, response) {
        
        console.log(url)
        console.log(sample)
        console.log(response)
        
        data_dict = {}
        data_dict["values"] = response[0]["otu_ids"]
        data_dict["labels"] = response[0]["sample_values"]
        data_dict["type"] = "pie"
        data = [data_dict]

        var layout = {
            height: 300,
            width: 400,
            margin: {
                l: 60,
                r: 60,
                b: 0,
                t: 0,
                pad: 2
        }
    };

                


        Plotly.newPlot('pie_chart', data, layout);
    });
}

init();