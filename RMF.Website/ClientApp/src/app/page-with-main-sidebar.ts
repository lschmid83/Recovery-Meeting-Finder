import { ActivatedRoute } from "@angular/router";
import { Title, Meta } from '@angular/platform-browser';

declare var $: any;

export class PageWithMainSidebar {

  constructor() {
  }

  public initMainSidebarJQuery() {

    // Hide main sidebar.
    $('#main-sidebar').css('width', '0px');
    $('#main-sidebar').removeClass('show');

    // Main nav toggle button.
    $('#main-sidebar-toggle').click(function () {
      if ($('#main-sidebar').hasClass('show'))
        closeMainNav();
      else
        openMainNav();
    });

    // Swipe close.
    var touchstartX = 0;
    var touchstartY = 0;
    var touchendX = 0;
    var touchendY = 0;

    var gestureZone = document.getElementById('main-sidebar');

    gestureZone.addEventListener('touchstart', function (event) {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
    }, { passive: true });

    gestureZone.addEventListener('touchend', function (event) {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;
      handleGesture();
    }, { passive: true });

    function handleGesture() {
      if (touchendX < (touchstartX - 100)) {
        closeMainNav();
        console.log('swipe left');
      }
    }

    // Close main nav on item click.
    $(document).click(function (e) {
      if (!$(e.target).is('#main-sidebar') &&
        !$(e.target).hasClass('list-group') &&
        !$(e.target).hasClass('list-group-item')) {
        closeMainNav();
      }
    });

    $('#main-sidebar-toggle').click(function (e) {
      e.stopPropagation();
      return false;
    });

    $('#main-sidebar-search-input').click(function (e) {
      e.stopPropagation();
      return false;
    });

    function openMainNav() {

      $('#main-sidebar').css('width', '340px');
      $('#main-sidebar').addClass('show');
      $('#main-sidebar').css('transition', '0.5s');

      // Get selected item from storage.
      var mainSidebarItem = localStorage.getItem('mainSidebarItem');
      var mainSidebarSubitem = localStorage.getItem('mainSidebarSubitem');

      // Remove dropdown class.
      $("#main-sidebar .sidebar-menu-item").attr("aria-expanded", "false");
      $("#main-sidebar .sidebar-dropdown").removeClass('show');

      // Set background color.
      $("#main-sidebar a").css('background-color', '#203177');
      $('#main-sidebar #' + mainSidebarSubitem).css('background-color', '#1d2a5e');
      $('#main-sidebar a[href="#' + mainSidebarItem + '"]').css('background-color', '#1d2a5e');

      // Add dropdown class to selected.
      $('#main-sidebar a[href="#' + mainSidebarItem + '"]').attr("aria-expanded", "true");
      $('#main-sidebar #' + mainSidebarItem).addClass('show');
    }

    function closeMainNav() {
      $('#main-sidebar').css('width', '0px');
      $('#main-sidebar').removeClass('show');
      $('#main-sidebar').css('margin-left', '0px');
      $('#main-sidebar').css('transition', '0.5s');
    }
  }
}
