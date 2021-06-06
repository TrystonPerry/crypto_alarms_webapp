import moment from "moment";

function createTimeChart({ ctx, chartType, values, label, minutes = 60 }) {
  return new window.Chart(ctx, {
    type: chartType,
    data: {
      labels: Object.keys(values).map((hour) => {
        const d = new Date(hour * minutes * 60 * 1000);
        const text = `${
          d.getMonth() + 1
        }/${d.getDate()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} GMT-0000`;
        const date = new Date(text);
        return moment(date.getTime()).format("L, HH:mm ");
      }),
      datasets: [
        {
          label,
          data: Object.values(values),
          backgroundColor: "rgb(0,0,0)",
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            display: false,
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

function createNormalChart({ ctx, chartType, values, label }) {
  return new window.Chart(ctx, {
    type: chartType,
    data: {
      labels: Object.keys(values),
      datasets: [
        {
          label,
          data: Object.values(values),
          backgroundColor: "rgb(0,0,0)",
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            display: false,
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

export default { createTimeChart, createNormalChart };
