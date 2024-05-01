import { Title, Meta } from '@angular/platform-browser';

declare var $: any;

export class PageWithMainMenu {

  constructor(public title: Title, public meta: Meta) {
  }

  public initJQuery(currentMenuItem, subMenuItem) {

    $(document).ready(function () {

      // Show subnav on menu item hover.
      $('.main-menu-item').on("mouseover", function (event) {
        var menuItemIndex = $(this).index();
        $('.main-menu-subnav').hide();
        $('.main-menu-subnav[data-id~="' + menuItemIndex + '"]').show();
      })

      var selectedMenuItem = 1;
      var selectedSubnavItem = 0;

      $('.main-menu-item').eq(currentMenuItem).css('background-color', '$secondary-color');
      $('.main-menu-item').eq(currentMenuItem).css('border-bottom', '3px solid var(--main-menu-nav-underline)');
      $('.main-menu-subnav[data-id~="' + currentMenuItem + '"]').show();
      $('.main-menu-subnav[data-id~="' + currentMenuItem + '"]').children().eq(subMenuItem).css('box-shadow', 'inset 0 -4px 0 0 var(--primary-color)');

      $('.main-menu-item').mouseenter(function (e) {
        $('.main-menu-item').css('background-color', '$primary-color');
        $('.main-menu-item').css('border-bottom', '3px solid var(--primary-color)');
        $(e.target).css('background-color', '$secondary-color');
        $(e.target).css('border-bottom', '3px solid var(--main-menu-nav-underline)');

      });
    });
  }

  public setPageTitle(title: string) {
    this.title.setTitle(title);
  }

  public setPageDescription(description: string) {
    this.meta.updateTag({ name: 'description', content: description });
  }
}
