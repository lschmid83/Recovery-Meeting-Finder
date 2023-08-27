import { ActivatedRoute } from "@angular/router";
import { PageWithMainMenu } from "./page-with-main-menu";
import { Title, Meta } from '@angular/platform-browser';

declare var $: any;

export class PageWithSidebar extends PageWithMainMenu {

  constructor(private route: ActivatedRoute, title: Title, meta: Meta) {
    super(title, meta);
  }

  public initJQuery(currentMenuItem, subMenuItem) {

    $(document).ready(function () {
      if ($(window).width() <= 768) {
        $('#sidebar').css('width', '0px');
        $('#sidebar').removeClass('show');
        $('#content-container').css('margin-left', '0px');
        $('#content-container').css('width', '100%');
      }
      setTimeout(function () {
        $('#sidebar').css('visibility', 'visible');
        $('#content-container').css('visibility', 'visible');
      }, 150);
    });

    // Swipe close.
    var touchstartX = 0;
    var touchstartY = 0;
    var touchendX = 0;
    var touchendY = 0;

    var gestureZone = document.getElementById('sidebar');

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
        closeNav();
      }
    }

    $(window).resize(function () {
      if ($(window).width() <= 768) {
        if ($('#sidebar').hasClass('show')) {
          closeNav();
        };
      }
      else {
        if (!$('#sidebar').hasClass('show')) {
          openNav();
        };
      }
    });

    $('#sidebar-toggle').click(function (e) {
      e.stopPropagation();
      if ($('#sidebar').hasClass('show'))
        closeNav();
      else
        openNav();
    });

    $('#content-container').click(function (e) {
      if ($(window).width() <= 768)
        closeNav();
    });

    $('.list-group-item').click(function () {
      if (!$(this).hasClass('drop-down') && $(window).width() <= 768)
        closeNav();
    });

    function openNav() {
      $('#sidebar').css('width', '340px');
      $('#sidebar').css('transition', '0.5s');
      $('#sidebar').addClass('show');
      if ($(window).width() > 768) {
        $('#content-container').css('margin-left', '340px');
        $('#content-container').css('transition', '0.5s');
        $('#content-container').css('width', 'calc(100vw - 340px)');
      }
    }

    function closeNav() {
      $('#sidebar').css('width', '0px');
      $('#sidebar').removeClass('show');
      $('#sidebar').css('transition', '0.5s');
      $('#content-container').css('margin-left', '0px');
      $('#content-container').css('transition', '0.5s');
      $('#content-container').css('width', '100%');
    }

    if (this.route.snapshot.fragment !== null)
      this.scrollToPageLoad(this.route.snapshot.fragment);

    super.initJQuery(currentMenuItem, subMenuItem);
  }

  // Animated scroll to.
  public scrollTo(elementId: string): void {
    if (elementId !== null) {
      window.history.pushState(null, null, window.location.pathname + '#' + elementId);
      document.getElementById(elementId).scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Non-animated scroll to on page load with interval to allow content to load.
  public scrollToPageLoad(elementId: string): void {
    if (elementId !== null) {
      window.history.pushState(null, null, window.location.pathname + '#' + elementId);
      const interval = setInterval(() => { document.getElementById(elementId).scrollIntoView(); clearInterval(interval) }, 250);
    }
  }
}
