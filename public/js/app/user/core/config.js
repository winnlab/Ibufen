var config = {
	router: {
		base: '/',
		modulesContainer: '#modules',
		modules: [
			{
				name: 'main',
				path: {
					client: 'js/app/user/modules/main/',
					server: ''
				}
			},
			{
				name: 'advices',
				path: {
					client: 'js/app/user/modules/advices/',
					server: ':name'
				}
			},
			{
				name: 'video',
				fake_path: ''
			}
		],
		defaultModule: 'main'
	}
};

export default config;