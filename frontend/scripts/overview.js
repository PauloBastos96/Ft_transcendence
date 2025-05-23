async function updateOverviewPage() {
    _user = await getUserData();
    document.getElementById('username').innerText = `${i18next.t('overview.greeting')} ${_user?.username}`;
    document.getElementById('user-avatar').src = _avatar;
    document.getElementById('games-played').innerText = `${i18next.t('overview.gamesPlayed')}: ${_user?.pong_games_played + _user?.ttt_games_played}`;
    document.getElementById('wins').innerText = `${i18next.t('overview.wins')}: ${_user?.pong_wins + _user?.ttt_wins}`;
    document.getElementById('losses').innerText = `${i18next.t('overview.losses')}: ${_user?.pong_losses + _user?.ttt_losses}`;
    document.getElementById('draws').innerText = `${i18next.t('overview.draws')}: ${_user?.ttt_draws}`;
    document.getElementById('pong-games-played').innerText = ` ${i18next.t('overview.gamesPlayed')}: ${_user?.pong_games_played}`;
    document.getElementById('pong-wins').innerText = `${i18next.t('overview.wins')}: ${_user?.pong_wins}`;
    document.getElementById('pong-losses').innerText = `${i18next.t('overview.losses')}: ${_user?.pong_losses}`;
    document.getElementById('ttt-games-played').innerText = `${i18next.t('overview.gamesPlayed')}: ${_user?.ttt_games_played}`;
    document.getElementById('ttt-wins').innerText = `${i18next.t('overview.wins')}: ${_user?.ttt_wins}`;
    document.getElementById('ttt-losses').innerText = `${i18next.t('overview.losses')}: ${_user?.ttt_losses}`;
    document.getElementById('ttt-draws').innerText = `${i18next.t('overview.draws')}: ${_user?.ttt_draws}`;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        let key = element.getAttribute('data-i18n');
        element.innerText = i18next.t(key);
    });
}