<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

// Create reference to store domains with OFAC sanctions
const ofacDomains = ref([]);
// Reference to store the chart instance
let chart = null;

onMounted(() => {
  console.log(props.data)
  // Process domains to find those with OFAC sanctions
  if (props.data) {
    // Handle both numbered properties and direct object properties
    const domainsData = typeof props.data === 'object' ? props.data : {};

    Object.keys(domainsData).forEach(key => {
      // Get the actual domain name and details
      // If key is numeric, the domain name is the value's property
      // Otherwise, the key itself is the domain name
      const domainEntry = domainsData[key];
      const domain = isNaN(Number(key)) ? key : key;
      const details = domainEntry;

      if (details && details.ofac === true) {
        ofacDomains.value.push({
          domain,
          ...details
        });
      }
    });
  }

  // Load required scripts dynamically
  loadAmCharts().then(() => {
    initializeChart();
  });
});

onBeforeUnmount(() => {
  // Dispose of the chart when component is unmounted
  if (chart) {
    chart.dispose();
  }
});

const loadAmCharts = () => {
  return new Promise((resolve) => {
    // Check if AmCharts is already loaded
    if (window.am4core) {
      resolve();
      return;
    }

    // Load core
    const coreScript = document.createElement('script');
    coreScript.src = 'https://cdn.amcharts.com/lib/4/core.js';
    document.body.appendChild(coreScript);

    // Load maps after core
    coreScript.onload = () => {
      const mapsScript = document.createElement('script');
      mapsScript.src = 'https://cdn.amcharts.com/lib/4/maps.js';
      document.body.appendChild(mapsScript);

      // Load geodata after maps
      mapsScript.onload = () => {
        const geodataScript = document.createElement('script');
        geodataScript.src = 'https://cdn.amcharts.com/lib/4/geodata/worldLow.js';
        document.body.appendChild(geodataScript);

        // Load animated theme after geodata
        geodataScript.onload = () => {
          const animatedScript = document.createElement('script');
          animatedScript.src = 'https://cdn.amcharts.com/lib/4/themes/animated.js';
          document.body.appendChild(animatedScript);

          // Resolve when all scripts are loaded
          animatedScript.onload = () => {
            resolve();
          };
        };
      };
    };
  });
};

const initializeChart = () => {
  // Apply animated theme if available
  if (window.am4core.useTheme) {
    window.am4core.useTheme(window.am4themes_animated);
  }

  // Create map instance
  chart = window.am4core.create("chartdiv", window.am4maps.MapChart);

  // Set map definition
  chart.geodata = window.am4geodata_worldLow;

  // Set projection
  chart.projection = new window.am4maps.projections.Miller();

  // Create map polygon series
  const polygonSeries = chart.series.push(new window.am4maps.MapPolygonSeries());

  // Exclude Antarctica
  polygonSeries.exclude = ["AQ"];

  // Make map load polygon data from GeoJSON
  polygonSeries.useGeodata = true;

  // Configure series
  const polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{name}";
  polygonTemplate.fill = window.am4core.color("#74B266");

  // Create hover state and set alternative fill color
  const hs = polygonTemplate.states.create("hover");
  hs.properties.fill = window.am4core.color("#367B25");

  // Add image series for location markers
  const imageSeries = chart.series.push(new window.am4maps.MapImageSeries());
  imageSeries.mapImages.template.propertyFields.longitude = "longitude";
  imageSeries.mapImages.template.propertyFields.latitude = "latitude";
  imageSeries.mapImages.template.tooltipText = "{title}";

  const circle = imageSeries.mapImages.template.createChild(window.am4core.Circle);
  circle.radius = 4;
  circle.propertyFields.fill = "color";
  circle.stroke = window.am4core.color("#FFFFFF");
  circle.strokeWidth = 2;

  const circle2 = imageSeries.mapImages.template.createChild(window.am4core.Circle);
  circle2.radius = 4;
  circle2.propertyFields.fill = "color";
  circle2.stroke = window.am4core.color("#FFFFFF");
  circle2.strokeWidth = 2;
  circle2.fillOpacity = 0.5;

  circle2.events.on("inited", function(event) {
    animateBullet(event.target);
  });

  function animateBullet(circle) {
    const animation = circle.animate(
      [
        { property: "scale", from: 1, to: 5 },
        { property: "opacity", from: 1, to: 0 }
      ],
      1000,
      window.am4core.ease.circleOut
    );

    animation.events.on("animationended", function(event) {
      animateBullet(event.target.object);
    });
  }

  const colorSet = new window.am4core.ColorSet();
  const mapData = [];

  if (props.data) {
    // Process all domain entries in the object
    Object.keys(props.data).forEach(key => {
      const domainEntry = props.data[key];
      const domainName = isNaN(Number(key)) ? key : key;

      // Check if geolocation data exists
      if (domainEntry && domainEntry.geolocation &&
          domainEntry.geolocation.latitude &&
          domainEntry.geolocation.longitude) {

        mapData.push({
          title: `${domainName}: ${domainEntry.geolocation.country_long || 'Unknown'}/${domainEntry.geolocation.region || 'Unknown'}`,
          latitude: domainEntry.geolocation.latitude,
          longitude: domainEntry.geolocation.longitude,
          color: colorSet.next()
        });
      }
    });
  }

  imageSeries.data = mapData;
};
</script>

<template>
  <section class="w-full">
    <div class="container mx-auto px-4">
      <div class="w-full">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6">
            <p class="font-bold text-lg mb-4">
              <i class="fas fa-globe-asia mr-2"></i> SERVER LOCATIONS
            </p>

            <div class="w-full">
              <div id="chartdiv" class="w-full h-96"></div>
            </div>

            <div class="mt-6" v-if="ofacDomains.length > 0">
              <p class="mb-4">This app may communicate with the following OFAC sanctioned list of countries.</p>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">DOMAIN</th>
                      <th class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">COUNTRY/REGION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in ofacDomains" :key="item.domain" class="hover:bg-gray-50">
                      <td class="py-2 px-4 border-b border-gray-200">{{ item.domain }}</td>
                      <td class="py-2 px-4 border-b border-gray-200" v-if="item.geolocation">
                        <strong>IP: </strong>{{ item.geolocation?.ip || 'N/A' }}<br/>
                        <strong>Country: </strong>{{ item.geolocation?.country_long || 'N/A' }}<br/>
                        <strong>Region: </strong>{{ item.geolocation?.region || 'N/A' }}<br/>
                        <strong>City: </strong>{{ item.geolocation?.city || 'N/A' }}<br/>
                      </td>
                      <td class="py-2 px-4 border-b border-gray-200" v-else>
                        No geolocation data available
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-6" v-if="ofacDomains.length === 0">
              <p class="text-green-600 font-semibold">No OFAC sanctioned domains detected.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#chartdiv {
  width: 100%;
  height: 500px;
  overflow: hidden;
}
</style>
