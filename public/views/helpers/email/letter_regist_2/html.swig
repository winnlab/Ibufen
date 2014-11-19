<table class="frame_table">
	<tr class="top_border">
		<td class="top_border">
			<img src="{{ site.baseUrl }}img/user/helpers/email/top_border.png" />
		</td>
	</tr>
	
	<tr class="frame_center">
		<td class="frame_center">
			
			<table class="center_table">
				<tr>
					<td class="left_border">
						<img src="{{ site.baseUrl }}img/user/helpers/email/left_border.png" />
					</td>
					
					<td class="content">
						
						<table class="topper_cell">
							<tr class="topper_top">
								<td class="topper_top">
									
									<table class="topper_table">
										<tr>
											<td class="logo_cell">
												<img class="logo" src="{{ site.baseUrl }}img/user/helpers/email/logo.png" />
											</td>
											
											<td class="greeting_cell">
												<div class="greeting">
													<div>
														Здравствуйте, {{ client.login|title }}
													</div>
													
													<div>
														Поздравляем, вы удачно зарегистрировались на сайте <a href="{{ site.baseUrl }}" target="_blank">agusha.com.ua</a>!
													</div>
												</div>
											</td>
										</tr>
									</table>
									
								</td>
							</tr>
							
							<tr>
								<td class="blue_triangle">
									<img src="{{ site.baseUrl }}img/user/helpers/email/blue_triangle.png" />
								</td>
							</tr>
						</table>
						
						<table class="info_table">
							<tr>
								<td>
									<img src="{{ site.baseUrl }}img/user/helpers/email/letter_regist_2_info.png" />
								</td>
							</tr>
						</table>
						
						<table class="join_table">
							<tr>
								<td>
									<img class="come_and_get" src="{{ site.baseUrl }}img/user/helpers/email/come_and_get.png" />
									
									<a href="{{site.linkTo('registration/activate/'+user._id)}}" class="button" target="_blank">
										<img src="{{ site.baseUrl }}img/user/helpers/email/blue_button.png" />
									</a>
									
									<img class="tell_friends" src="{{ site.baseUrl }}img/user/helpers/email/tell_friends.png" />
									
									<div class="social">
										<a class="social_icon" href="http://agusha.com.ua:8080" target="_blank">
											<img src="{{ site.baseUrl }}img/user/helpers/email/facebook.png" />
										</a>
										
										<a class="social_icon" href="http://agusha.com.ua:8080" target="_blank">
											<img src="{{ site.baseUrl }}img/user/helpers/email/vk.png" />
										</a>
										
										<a class="social_icon" href="http://agusha.com.ua:8080" target="_blank">
											<img src="{{ site.baseUrl }}img/user/helpers/email/odnoklasniki.png" />
										</a>
									</div>
								</td>
							</tr>
						</table>
						
						<table class="footer_table">
							<tr>
								<td>
									<div class="half left">
										<img class="copyright" src="{{ site.baseUrl }}img/user/helpers/email/copyright.png" />
									</div>
									
									<div class="half right">
										<a class="decline" href="http://agusha.com.ua:8080" target="_blank">
											<img src="{{ site.baseUrl }}img/user/helpers/email/decline.png" />
										</a>
									</div>
								</td>
							</tr>
						</table>
						
					</td>
					
					<td class="right_border">
						<img src="{{ site.baseUrl }}img/user/helpers/email/left_border.png" />
					</td>
				</tr>
			</table>
			
		<td>
	</tr>
	
	<tr class="bottom_border">
		<td class="top_border">
			<img src="{{ site.baseUrl }}img/user/helpers/email/top_border.png" />
		</td>
	</tr>
</table>