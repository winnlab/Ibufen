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
			}
		],
		defaultModule: 'main'
	}
};

export default config;