<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  
  <xsl:param name="inputvar-odkazy_h" select="''"/>
  <xsl:param name="inputvar-odkazy_desc" select="''"/>
  <xsl:param name="inputvar-otazky_h" select="''"/>
  <xsl:param name="inputvar-otazky_desc" select="''"/>
  <xsl:param name="linklist" select="'&lt;p&gt;&lt;em&gt;Nebyly nalezeny žádné odkazy.&lt;/em&gt;&lt;/p&gt;'"/>
  <xsl:param name="agregator-current-stitek" select="'nejčtenější'"/>

  <xsl:template match="h2[@id='clanky']">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()"/>
      <span>
        <a title="Aktuální filtr" class="tag nowarning"><span class="fas fa-tag">i</span><xsl:value-of disable-output-escaping="yes" select="$agregator-current-stitek"/></a>
      </span>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="//body/div/div[contains(@class, 'section')]">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()"/>
      <div class="part internetguru">
        <h2 id="ebook">Nová elektronická kniha</h2>
        <p class="description">Chystáme se vydat e-book se články tohoto webu. Získáte tím všechny články autora do své oblíbené čtečky. Koupí e-booku navíc podpoříte další rozvoj tohoto webu.</p>
        <ol class="list--ico">
          <li><span class="fas fa-fw fa-check">i</span>E-book pro všechny druhy čteček plus formát PDF.</li>
          <li><span class="fas fa-fw fa-check">i</span>Automatické aktualizace a přidávání nových článků!</li>
          <li><span class="fas fa-fw fa-check">i</span>Zajímá Vás e-book? <label for="mce-EMAIL">Nechte se informovat!</label></li>
        </ol>
        <form action="https://hostovka.us2.list-manage.com/subscribe/post?u=5971b7be214389f4b2b105300&amp;id=f5d1b64499" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form">
          <div>
          <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL" placeholder="josef.novak@seznam.cz" required="required"/>
            <button type="submit" name="subscribe" id="mc-embedded-subscribe" class="button button--simple button--img button--img-inline"><span class="fas fa-fw fa-plus">i</span>Informujte mě</button>
          </div>
        </form>
      </div>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="//*[contains(@class, 'example')]">
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <span class="fas fa-fw fa-info">i</span>
      <xsl:apply-templates select="node()"/>
    </xsl:copy>
  </xsl:template>
  <xsl:template match="//*[contains(@class, 'important')]">
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <span class="fas fa-fw fa-exclamation">i</span>
      <xsl:apply-templates select="node()"/>
    </xsl:copy>
  </xsl:template>


  <xsl:template match="div[@class='part feedback']">
    <div class="part docinfo-wrap">
      <xsl:copy-of select="//div[@id='content']/div[@class='list list-wrapper--multiple'][last()]"/>
    </div>
    <xsl:copy-of select="."/>
  </xsl:template>
  
  <xsl:template match="//div[contains(@class, 'part clanky')]/div[@class='list list-wrapper--multiple']/div">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
      <div class="moreable-linkwrapper">
        <a class="button button--simple" href="seznam_clanku">Zobrazit seznam všech článků</a>
      </div>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="//div[@id='content']/div[@class='list list-wrapper--multiple'][last()]"/>
  
  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
