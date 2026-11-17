/* global GlideRecord, gs */
// Fix script: create the "Claude Learning Portal Users" group, add the first ten
// active users whose name starts with "ab", and grant the group the
// x_ibmin_claudel.user role. Members inherit the role from the group.
//
// Run on the target instance under System Definition > Scripts - Background
// (global scope). Safe to re-run: every step checks before it creates anything.
// Not part of the app build; nothing in src/ imports it.
//
// 1. Run once with DRY_RUN = true and read the output.
// 2. Set DRY_RUN = false and run again to apply.
(function () {
  var DRY_RUN = true;

  var ROLE_NAME = 'x_ibmin_claudel.user';
  var GROUP_NAME = 'Claude Learning Portal Users';
  var NAME_PREFIX = 'ab';
  var MAX_USERS = 10;

  function log(message) {
    gs.print((DRY_RUN ? '[DRY RUN] ' : '') + message);
  }

  // True when a row in `table` matches every field/value pair in `fields`.
  function rowExists(table, fields) {
    var gr = new GlideRecord(table);
    for (var key in fields) {
      gr.addQuery(key, fields[key]);
    }
    gr.setLimit(1);
    gr.query();
    return gr.hasNext();
  }

  // The role is created by deploying the app. Stop if it is not there yet.
  var role = new GlideRecord('sys_user_role');
  if (!role.get('name', ROLE_NAME)) {
    gs.print('ABORT: role ' + ROLE_NAME + ' not found. Deploy the app first.');
    return;
  }
  var roleId = role.getUniqueValue();

  // The first MAX_USERS active users by name whose name starts with the prefix.
  var users = [];
  var userGr = new GlideRecord('sys_user');
  userGr.addActiveQuery();
  userGr.addQuery('name', 'STARTSWITH', NAME_PREFIX);
  userGr.orderBy('name');
  userGr.setLimit(MAX_USERS);
  userGr.query();
  while (userGr.next()) {
    users.push({id: userGr.getUniqueValue(), name: userGr.getValue('name')});
  }
  if (users.length === 0) {
    gs.print('ABORT: no active users found with a name starting with "' + NAME_PREFIX + '".');
    return;
  }
  log('Found ' + users.length + ' user(s) starting with "' + NAME_PREFIX + '".');

  // Group: reuse it when it already exists.
  var groupId = '';
  var group = new GlideRecord('sys_user_group');
  if (group.get('name', GROUP_NAME)) {
    groupId = group.getUniqueValue();
    log('Group exists: ' + GROUP_NAME + ' (' + groupId + ')');
  } else {
    log('Create group: ' + GROUP_NAME);
    if (!DRY_RUN) {
      group.initialize();
      group.setValue('name', GROUP_NAME);
      group.setValue(
        'description',
        'Learners allowed to open the Claude Learning Portal and use Claude search.'
      );
      groupId = group.insert();
      if (!groupId) {
        gs.print('ABORT: could not create group ' + GROUP_NAME);
        return;
      }
    }
  }

  // Role on the group. A dry run with no group yet cannot check, so it reports "would grant".
  if (groupId && rowExists('sys_group_has_role', {group: groupId, role: roleId})) {
    log('Group already has role ' + ROLE_NAME);
  } else {
    log('Grant role ' + ROLE_NAME + ' to group ' + GROUP_NAME);
    if (!DRY_RUN) {
      var groupRole = new GlideRecord('sys_group_has_role');
      groupRole.initialize();
      groupRole.setValue('group', groupId);
      groupRole.setValue('role', roleId);
      groupRole.insert();
    }
  }

  // Members.
  var added = 0;
  var skipped = 0;
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    if (groupId && rowExists('sys_user_grmember', {group: groupId, user: user.id})) {
      skipped++;
      log('Already a member: ' + user.name);
      continue;
    }
    log('Add member: ' + user.name);
    if (!DRY_RUN) {
      var member = new GlideRecord('sys_user_grmember');
      member.initialize();
      member.setValue('group', groupId);
      member.setValue('user', user.id);
      member.insert();
    }
    added++;
  }

  log('Done. ' + added + ' member(s) ' + (DRY_RUN ? 'to add' : 'added') + ', ' + skipped + ' already in the group.');
})();
