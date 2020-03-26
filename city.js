function City(id, name, ascii, alt_name, lat, long, feat_class, feat_code, country, cc2, admin3, admin4, population, elevation, dem, tz, modified_at) {
    this.id = id;
    this.name = name;
    this.ascii = ascii;
    this.alt_name = alt_name;
    this.lat = lat;
    this.long = long;
    this.feat_class = feat_class;
    this.feat_code = feat_code;
    this.country = country;
    this.cc2 = cc2;
    this.admin3 = admin3;
    this.admin4 = admin4;
    this.population = population;
    this.elevation = elevation;
    this.dem = dem;
    this.tz = tz;
    this.modified_at = modified_at;
    this.score = 1;
  }
  
  module.exports = City;