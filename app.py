# Dependencies
import numpy as np
import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify,
    request)

belly_metadata = pd.read_csv("DataSets/Belly_Button_Biodiversity_Metadata.csv")
belly_otu = pd.read_csv("DataSets/belly_button_biodiversity_otu_id.csv")
belly_sample = pd.read_csv("DataSets/belly_button_biodiversity_samples.csv")
meta_columns = pd.read_csv("DataSets/metadata_columns.csv")


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

# Routes required
@app.route('/names')
def names():

    list_names=list(belly_sample)
    list_names=list_names[1:]
    return jsonify(list_names)

@app.route('/otu')
def otu():
    list_otu=list(belly_otu['lowest_taxonomic_unit_found'])
    list_otu
    return jsonify(list_otu)
 
@app.route('/metadata/<sample>')
def metadata(sample):
 
    df_belly_metadata = belly_metadata.loc[belly_metadata["SAMPLEID"] == int(sample.split('_')[1]), ['AGE','BBTYPE','ETHNICITY','GENDER','LOCATION','SAMPLEID']]
    return jsonify(df_belly_metadata.to_dict(orient="records"))


@app.route('/wfreq/<sample>')
def wfreq(sample):
    df_belly_metadata_wfreq = belly_metadata.loc[belly_metadata["SAMPLEID"] == int(sample.split('_')[1]), ['WFREQ']]
    wfreq=list(df_belly_metadata_wfreq['WFREQ'])[0]
    return jsonify(wfreq)

@app.route('/samples/<sample>')
def samples(sample):

    belly_sample_name_sort=belly_sample.sort_values(by=sample,ascending=False)[[sample]].head(10)
    belly_sample_otu_sort=belly_sample.sort_values(by=sample,ascending=False)[['otu_id']].head(10)
    df_final=pd.concat([belly_sample_otu_sort,belly_sample_name_sort],axis=1)
    df_final.columns = ['otu_ids', 'sample_values']
    
    return jsonify([df_final.to_dict(orient="lists")])

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
