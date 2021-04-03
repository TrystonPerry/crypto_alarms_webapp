import moment from "moment";

export default ({ ctx, chartType, values, label, minutes = 60 }) => {
  return new window.Chart(ctx, {
    type: chartType,
    data: {
      labels: Object.keys(values).map((hour) => {
        const date = new Date(hour * minutes * 60 * 1000);
        return moment(date.getTime()).format("L, h:mm a");
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
};