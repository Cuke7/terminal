import { Handler } from '@netlify/functions'
var axios = require("axios");


export const handler: Handler = async (event: any, context) => {

  let stopguess = event.queryStringParameters.stopguess;
  if (stopguess) {
    let stopsList = await axios({
      method: "GET",
      url: "https://ws.infotbm.com/ws/1.0/get-schedule/" + encodeURIComponent(stopguess),
    });

    let data = stopsList.data;

    let responses = [];

    for (const stop of data) {
      responses.push({
        text: stop.name + " (" + stop.city + ")",
        id: stop.id,
      });
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        responses
      }),
    }
  }


  let stopID = event.queryStringParameters.stopID;
  if (stopID) {
    let dataRespnose = await axios({
      method: "GET",
      url: "https://ws.infotbm.com/ws/1.0/network/stoparea-informations/" + encodeURIComponent(stopID),
    });

    let data = dataRespnose.data;

    let routes = [];

    if (data.stopPoints) {
      for (const stopPoint of data.stopPoints) {
        for (const route of stopPoint.routes) {
          route.stopPointId = stopPoint.id;
          route.stopPointName = stopPoint.name;
          routes.push(route);
        }
      }

      routes = routes.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);
      routes = routes.filter((route) => route.id.includes("TBC") || route.id.includes("TBT"));

      let customRoutes = [];

      for (const route of routes) {
        // let infos = await axios({
        //     method: "GET",
        //     url: "https://ws.infotbm.com/ws/1.0/network/line-informations/" + route.line.id.split(":")[route.line.id.split(":").length - 1],
        // });

        // let url = infos.data.picto;

        customRoutes.push({
          stopPointName: route.stopPointName,
          direction: route.name,
          lineName: route.line.name,
          externalCode: route.stopPointId.split(":SP:")[1],
          code: route.line.name.includes("Tram") ? route.line.name.split("Tram ")[1] : route.line.id.split(":")[route.line.id.split(":").length - 1],
          // picto: url,
        });
      }
      return {
        statusCode: 200,
        body: JSON.stringify(
          { stopName: data.name + " (" + data.city + ")", routes: customRoutes }
        ),
      }
    }
  }

  // Get the ETA for a specifc stop (externalCode) and a specific line (code)
  let externalCode = event.queryStringParameters.externalCode;
  let code = event.queryStringParameters.code;

  if (externalCode && code) {
    let pass = await axios({
      method: "GET",
      url: " https://ws.infotbm.com/ws/1.0/get-realtime-pass/" + encodeURIComponent(externalCode) + "/" + encodeURIComponent(code),
    });

    let destinations = pass.data.destinations;
    let destinationsKeys = Object.keys(destinations);

    let response = [];

    for (const key of destinationsKeys) {
      let destination = destinations[key];
      let results = [];
      for (const eta of destination) {
        results.push({
          destinationName: eta.destination_name,
          waitTimeText: eta.waittime_text,
          waitTime: eta.waittime,
        });
      }
      response.push(results);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  }

}
