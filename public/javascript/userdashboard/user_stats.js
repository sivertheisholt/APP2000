
/**
 * Charts til statistikksiden inne på bruker dashbordet
 * @author Ørjan Dybevik - 233530, Sivert - 233518
 */
document.addEventListener('DOMContentLoaded', function () {
    Highcharts.chart(userStats.charts[0]);
    Highcharts.chart(userStats.charts[1]);
    Highcharts.chart(userStats.charts[2]);
    Highcharts.chart(userStats.charts[3]);
});