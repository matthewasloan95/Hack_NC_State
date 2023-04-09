# read in the shapefile and soil data
states = gpd.read_file('data/cb_2018_us_state_500k.shp')
states = states.rename(columns={"STUSPS": "State"})
soil = gpd.read_file('data/Table_S1.csv')

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
m = folium.Map(location=[39.8283, -98.5795], zoom_start=4)
