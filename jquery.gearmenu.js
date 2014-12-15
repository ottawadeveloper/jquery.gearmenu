var GearMenu = {
  
  defaultGearPath: '/jquery.gearmenu/images/os-gear.png',
  
  defaultGearClass: 'gearmenu-style--menu-activator-icon--default',
  
  defaultGearAltText: 'Context menu',
  
  generateGearMenu: function(menuID) {
    var gearMenuActivatorHTML = '<div';
    gearMenuActivatorHTML += ' data-menu-target-id="' + menuID + '"';
    gearMenuActivatorHTML += ' class="gearmenu-element--menu-activator"';
    gearMenuActivatorHTML += '>';
    var gearPath = GearMenu.defaultGearPath;
    var overrideGearPath = $('#' + menuID).attr('data-gearmenu-gear-path');
    if (overrideGearPath !== undefined && overrideGearPath !== '') {
      gearPath = overrideGearPath;
    }
    gearMenuActivatorHTML += '<img src="' + gearPath + '"';
    var gearClass = GearMenu.defaultGearClass;
    var overrideGearClass = $('#' + menuID).attr('data-gearmenu-gear-class');
    if (overrideGearClass !== undefined && overrideGearClass !== '') {
      gearClass = overrideGearClass;
    }
    gearMenuActivatorHTML += ' class="' + gearClass + '"';
    var gearAltText = GearMenu.defaultGearAltText;
    var overrideGearAltText = $('#' + menuID).attr('data-gearmenu-gear-alt-text');
    if (overrideGearAltText !== undefined && overrideGearAltText !== '') {
      gearAltText = overrideGearAltText;
    }
    gearMenuActivatorHTML += ' alt="' + gearAltText + '"';
    gearMenuActivatorHTML += ' />';
    gearMenuActivatorHTML += '</div>';
    return gearMenuActivatorHTML;
  },

  applyGearMenuItem: function(menuContainer, menuID) {
    menuContainer.append(GearMenu.generateGearMenu(menuID));
    menuContainer.addClass('gearmenu-js--contains-gear-menu');
  },
  
  determineSlideDirection: function(activator) {
    var slideClass = 'gearmenu-js--slideout-';
    if (activator.position().left < (jQuery(window).width() / 2)) {
      slideClass += 'right';
    }
    else {
      slideClass += 'left';
    }
    return slideClass;
  },

  showGearMenu: function(activator) {
    var menuID = activator.attr('data-menu-target-id');
    var actualMenuID = 'gear_menu_' + menuID;
    GearMenu.ensureGearMenuExists(menuID, actualMenuID);
    var menu = jQuery('#' + actualMenuID);
    jQuery('#' + actualMenuID).css({
       top: (activator.position().top + activator.outerHeight()) + 'px',
       left: (activator.position().left - menu.outerWidth() + activator.outerWidth()) + 'px',
       display: 'block',
    }).addClass('gearmenu-js--is-active').addClass(GearMenu.determineSlideDirection(activator));
  },

  closeGearMenus: function() {
    jQuery('.gearmenu-js--is-active').css({
        'display': 'none',
    }).removeClass('gearmenu-js--is-active');
  },

  ensureGearMenuExists: function(menuID, actualMenuID) {
    if (jQuery('#' + actualMenuID).length === 0) {
      GearMenu.createGearMenu(menuID, actualMenuID);
    }
  },

  createGearMenu: function(menuID, actualMenuID) {
    var menuHTML = GearMenu.buildGearMenu(menuID, actualMenuID);
    jQuery('body').append(menuHTML);  
  },

  buildGearMenu: function(menuID, actualMenuID) {
    var menuHTML = '<ul';
    menuHTML += ' class="gearmenu-element--menu"';
    menuHTML += ' id="' + actualMenuID + '"';
    menuHTML += '>';
    menuHTML += GearMenu.buildGearMenuChildren(menuID);
    menuHTML += '</ul>';
    return menuHTML;  
  },

  buildGearMenuChildren: function(menuID) {
    var gearChildren = '';
    var count = 0;
    var menuDepth = 1;
    jQuery('#' + menuID + ' menuitem, #' + menuID + ' menu').each(function() {
      count++;
      var tag = this.tagName.toLowerCase();
      if (tag === 'menu') {
        gearChildren += GearMenu.buildGearMenuChild(jQuery(this));
        menuDepth++;
      }
      else {
        var itemDepth = GearMenu.determineMenuItemDepth(jQuery(this), menuID);
        while (itemDepth < menuDepth) {
            gearChildren += GearMenu.finishGearMenuChild();
            menuDepth--;
        }
        gearChildren += GearMenu.buildGearMenuItemChild(jQuery(this), menuID, count);
      }
    });
    while (menuDepth > 1) {
      gearChildren += GearMenu.finishGearMenuChild();
      menuDepth--;
    }
    return gearChildren;
  },

  determineMenuItemDepth: function(menuitem, menuID) {
    var depth = 1;
    var parent = jQuery(menuitem.parent());
    while (parent.attr('id') !== menuID) {
      if (parent[0].tagName.toLowerCase() === 'menu') {
        depth++;
      }
      parent = jQuery(parent.parent());
    }
    return depth;
  },

  buildGearMenuChild: function(menu) {
    var menuHTML = '<li';
    menuHTML += ' class="gearmenu-style--has-children"';
    menuHTML += '>';
    menuHTML += menu.attr('label');
    menuHTML += '<ul>';
    return menuHTML;
  },

  finishGearMenuChild: function() {
    return '</li></ul>';
  },

  buildGearMenuItemChild: function(menuitem, menuID, count) {
    var itemID = 'gear_menuitem_' + menuID + "_" + count;
    var isDisabled = menuitem.attr('disabled');
    
    var disabled = (isDisabled !== undefined && isDisabled !== 'false' && isDisabled !== false);
    var itemHTML = '<li';
    itemHTML += ' id="' + itemID + '"';
    if (disabled) {
      itemHTML += ' class="gearmenu-style--disabled"';
    }
    itemHTML += '>';
    var icon = menuitem.attr('icon');
    if (icon !== undefined && icon !== '') {
      itemHTML += '<img src="' + icon + '" class="gearmenu-element--icon" /> ';
    }
    itemHTML += menuitem.attr('label');
    itemHTML += '</li>';
    if (!disabled) {
      var jsonclick = menuitem.attr('onclick');
      if (jsonclick !== undefined) {
        if (jQuery(window).on !== undefined) {
          jQuery(window).on('click', '#' + itemID, jsonclick);
        }
        else {
          jQuery('#' + itemID).live('click', jsonclick);
        }
      }
    }
    return itemHTML;
  },

};

(function($) {
 
  $.gearMenuize = function() {
    $('menu').gearMenuize();
  };
  
  $.fn.gearMenuize = function() {
    $(this).each(function() {
      if ($(this).parents('menu').length === 0) {
        var menuID = $(this).attr('id');
        $('[contextmenu="' + menuID + '"]').each(function() {
          GearMenu.applyGearMenuItem($(this), menuID);
        });
        $('#' + menuID).addClass('gearmenu-js--gearmenu-enabled');
      }
    });
  };
  
})(jQuery);

jQuery(document).ready(function() {
  if ($(window).on !== undefined) {
    $(window).on('click', function() {
      GearMenu.closeGearMenus();
    });
    $(window).on('click', '.gearmenu-element--menu-activator', function(event) {
       event.stopPropagation();
       GearMenu.closeGearMenus();
       GearMenu.showGearMenu($(this));
    });
  }
  else {
    $(window).click(function() {
      GearMenu.closeGearMenus();
    });
    $('.gearmenu-element--menu-activator').live('click', function(event) {
       event.stopPropagation();
       GearMenu.closeGearMenus();
       GearMenu.showGearMenu($(this));
    });
  }
});
