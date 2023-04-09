# import necessary libraries
import pandas as pd 
from flask import Flask, render_template
import folium
from folium.features import GeoJsonTooltip
import geopandas as gpd

# # create Flask app
app = Flask(__name__, template_folder='templates')



# Route for home page
@app.route("/")
def home():
    return render_template('index.html')

# Route for about page
@app.route("/about/")
def about():
    return render_template('about.html')

# Route for infoResource page
@app.route("/infoResources/")
def infoResources():
    return render_template('infoResources.html')

# Route for game page
@app.route("/game/")
def game():
    return render_template('game.html')

# Route for more info on Ideas page
@app.route("/ideaInfo/")
def ideaInfo():
    return render_template('inDepth.html')



# Route for editing the profile page
@app.route("/saveThemPandas/")
def saveThePands():
    return render_template('saveThemPandas.html')

# # define route to display map
@app.route('/globalSeq/')
def globalSeq():

    # read in the shapefile and soil data
    states = gpd.read_file('data/cb_2018_us_state_500k.shp')
    states = states.rename(columns={"STUSPS": "State"})
    soil = gpd.read_file('data/Table_S1.csv')
 
    for state in soil['State'].unique():
        soil.loc[soil['State'] == state].geometry = states.loc[states['State'] == state].geometry
    
    # merge the dataframes and set the geometry column
    merged_df = pd.merge(soil, states[['State', 'geometry']], on='State', how='left')
    merged_df = merged_df.set_geometry('geometry_y')

    # subset the "states" geopandas dataframe and merge with the soil dataframe
    subset_states = states[states['State'].isin(soil['State'])]
    merged_df = soil.merge(subset_states, on='State')
    merged_df['geometry'] = merged_df['geometry_y']
    final_gdf = gpd.GeoDataFrame(merged_df, geometry='geometry')
    final_gdf = final_gdf.drop(['geometry_x', 'geometry_y'], axis=1)

    # create the map using folium
    m = folium.Map(location=[39.8283, -98.5795], zoom_start=4, width='50%', height='50%')

    # add the GeoJSON layer to the map
    folium.GeoJson(final_gdf).add_to(m)
    
    # render the map using a Flask template
    # return render_template('map.html', map=m._repr_html_())
    map_html = """<!DOCTYPE html>
<html>
<head>
    <title>My Map</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='leaflet.css') }}" />
    <script src="{{ url_for('static', filename='leaflet.js') }}"></script>
</head>
<body>
    <div id="map">
        {{ map_html|safe }}
    </div>
</body>"""


    # rid of the abbreviations
    state_names = {
    'WA': 'Washington',
    'OR': 'Oregon',
    'CA': 'California',
    'ID': 'Idaho',
    'MT': 'Montana',
    'WY': 'Wyoming',
    'CO': 'Colorado',
    'UT': 'Utah',
    'NV': 'Nevada',
    'AZ': 'Arizona',
    'NM': 'New Mexico'
    }

    final_gdf['State'] = final_gdf['State'].replace(state_names)

    highlight_func = lambda x: {
    'fillColor': 'red',
    'fillOpacity': 0.5,
    'weight': 2,
    'color': 'red',
    'dashArray': '5, 5'
}

    # Create a tooltip for the GeoJSON layer
    tooltip = GeoJsonTooltip(fields=['State', 'Carbon sequestration potential during 2020-2099 (TgC) High Priority',
                                    "% of Forested Area (%) Low Priority", 'Area (km2 ) Medium Priority', 
                                    '% of Forested Area (%) Medium Priority', 'Area (km2 ) High Priority', 
                                    '% of Forested Area (%) High Priority', 'Carbon sequestration potential during 2020-2099 (TgC) Low Priority',
                                    'Carbon sequestration potential during 2020-2099 (TgC) Medium Priority', 
                                    'Carbon sequestration potential during 2020-2099 (TgC) High Priority'],
                                    aliases=['State', 'Carbon sequestration potential during 2020-2099 (TgC) High Priority:',
                                    "% of Forested Area (%) Low Priority", 'Area (km2 ) Medium Priority:', 
                                    '% of Forested Area (%) Medium Priority', 'Area (km2 ) High Priority:', 
                                    '% of Forested Area (%) High Priority', 'Carbon sequestration potential during 2020-2099 (TgC) Low Priority:',
                                    'Carbon sequestration potential during 2020-2099 (TgC) Medium Priority:', 
                                    'Carbon sequestration potential during 2020-2099 (TgC) High Priority:'], 
                                    localize=True)
    
       # Create a GeoJSON layer from the geopandas dataframe, tooltip and highlight
    geojson_layer = folium.GeoJson(final_gdf, tooltip=tooltip, highlight_function=highlight_func)
    # geojson_layer.add_child(tooltip)

    # Add the GeoJSON layer to the map
    geojson_layer.add_to(m)

    # save it for use
    m.save('templates/map.html')

    return render_template("map.html", map_html=map_html)

# # run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
