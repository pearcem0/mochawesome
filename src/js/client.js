/*global Chart*/
/*global $*/
/*global document*/
$(function() {
  'use strict';
  var filters = {
    'summary-passes': '.passed',
    'summary-failures': '.failed',
    'summary-pending': '.pending'
  };
  var activeFilters = [];
  addEventHandlers();
  makeSuiteCharts();

  function makeSuiteCharts() {
    var chartOpts = {
      percentageInnerCutout : 70,
      animationEasing: 'easeOutQuint',
      showTooltips: false
    };
    var suiteCharts = document.getElementsByClassName('suite-chart');
    for (var i=0; i<suiteCharts.length; i++) {
      var ctx = suiteCharts[i].getContext('2d');
      var data = [{
        value: suiteCharts[i].getAttribute('data-total-passes')*10,
        color: '#5cb85c',
        highlight: '#FF5A5E',
        label: 'Passed'
      },
      {
        value: suiteCharts[i].getAttribute('data-total-failures')*10,
        color: '#d9534f',
        highlight: '#FFC870',
        label: 'Failed'
      },
      {
        value: suiteCharts[i].getAttribute('data-total-pending')*10,
        color: '#999999',
        highlight: '#FFC870',
        label: 'Pending'
      },
      {
        value: suiteCharts[i].getAttribute('data-total-skipped')*10,
        color: '#EEEEEE',
        highlight: '#FFC870',
        label: 'Skipped'
      }];
      new Chart(ctx).Doughnut(data, chartOpts);
    }
  }

  function addEventHandlers() {
    $('.summary-filter').on('click', function () {
      var $el = $(this),
          $parent = $el.parent('.summary-col'),
          filter = $parent[0].className.split(' ')[1];

      if ($parent.hasClass('selected')) {
        $parent.removeClass('selected');
        activeFilters.splice(activeFilters.indexOf(filter), 1);
      } else {
        $parent.addClass('selected');
        activeFilters.push(filter);
      }

      updateFilteredTests();
    });
  }

  function updateFilteredTests() {
    var $details = $('.details'),
        filterClasses = 'filter-passed filter-failed filter-pending',
        classToAdd, i;

    $details.removeClass(filterClasses);
    $details.toggleClass('filters-active', activeFilters.length > 0);

    if (activeFilters.length) {
      for (i=0; i < activeFilters.length; i++) {
        classToAdd = 'filter-' + filters[activeFilters[i]].replace('.', '');
        $details.addClass(classToAdd);
      }
    }

    // Hide suites that are empty after filtering
    $('.suite.has-suites').each(function (i, suite) {
      var $suite = $(suite);
      $suite.removeClass('hidden');
      if ($suite.find('.suite').filter(':visible').length === 0) {
        $suite.addClass('hidden');
      }
    });
  }

});