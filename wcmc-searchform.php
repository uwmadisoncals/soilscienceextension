<div class="wcmc-search" rol="search">

    <h2 class="widget-title">WCMC Searchform</h2>
    <br />

    <p>Search by year and subject:</p>

	<form role="search" class="wcmc-form" action="<?php echo site_url('/sr'); ?>" method="GET" name="yearsubject">

		<select id="yearselect" class="yearselect" name="yr">
			<option value="2013" name="yr">2013</option>
			<option value="2012" name="yr">2012</option>
			<option value="2011" name="yr">2011</option>
			<option value="2010" name="yr">2010</option>
			<option value="2009" name="yr">2009</option>
			<option value="2008" name="yr">2008</option>
			<option value="2007" name="yr">2007</option>
			<option value="2006" name="yr">2006</option>
			<option value="2005" name="yr">2005</option>
			<option value="20%%" name="yr">2004</option>
		</select>

		<select name="subject">
			<option value="nutrient management" name="subject">Nutrient Management</option>
			<option value="insects and disease" name="subject">Insects and Disease</option>
			<option value="weed management" name="subject">Weed Management</option>
			<option value="vegetable management" name="subject">Vegetable Management</option>
			<option value="forages" name="subject">Forages</option>
			<option value="grain topics" name="subject">Grain Topics</option>
			<option value="soil, water and climate" name="subject">Soil, Water and Climate</option>
			<option value="manure" name="subject">Manure</option>
			<option value="agriculture business" name="subject">Ag Business</option>
			<option value="agriculture regulation" name="subject">Ag Regulation</option>
			<option value="genetics" name="subject">Genetics</option>
			<option value="all subjects" name="subject">ALL SUBJECTS</option>
		</select>

		<input type="submit" name="submit" alt="Search" value="Go" />
			
	</form>
	<br />

	<p>Search by year and author:</p>
	<form role="search" class="wcmc-form" action="<?php echo site_url('/sr'); ?>" method="GET" name="authorsearch">
		<select class="yearselect" name="yr">
			<option value="2013" name="yr">2013</option>
			<option value="2012" name="yr">2012</option>
			<option value="2011" name="yr">2011</option>
			<option value="2010" name="yr">2010</option>
			<option value="2009" name="yr">2009</option>
			<option value="2008" name="yr">2008</option>
			<option value="2007" name="yr">2007</option>
			<option value="2006" name="yr">2006</option>
			<option value="2005" name="yr">2005</option>
			<option value="20%%" name="yr">2004</option>
		</select>
		<input type="text" name="auth" size="20" alt="Search" value="" />
		<input type="submit" name="submit" alt="Search" value="Go" />
	</form>

	<br />

	<p>Search all years by keyword:</p>
	<form action="<?php echo site_url('/sr'); ?>" method="GET">
		<input type="text" value="" size="20" name="keyword">
		<input type="submit" value="Go" name="submit">
	</form>

</div><!-- .search -->

  