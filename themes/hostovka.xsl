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

  <xsl:template match="//*[contains(@class, 'example')]">
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <span class="fas fa-fw fa-lightbulb">i</span>
      <xsl:apply-templates select="node()"/>
    </xsl:copy>
  </xsl:template>
<!--   <xsl:template match="//*[contains(@class, 'important')]">
    <xsl:copy>
      <span class="fas fa-fw fa-exclamation-triangle">i</span>
      <xsl:apply-templates select="@* | node()"/>
    </xsl:copy>
  </xsl:template> -->
  
  <!-- 

  
  <xsl:template match="div[ol[contains(@class, 'otazky')]]">
    <xsl:copy-of select="."/>
    <h2 id="docinfo" class="hide">Informace o článku</h2>
    <xsl:copy-of select="//ul[@class = 'docinfo nomultiple global']"/>
    <xsl:copy-of select="//ul[@class = 'share nomultiple']"/>
  </xsl:template>
  
  <xsl:template match="//ul[@class = 'docinfo nomultiple global']"/>
  <xsl:template match="//ul[@class = 'share nomultiple']"/>
-->
  
  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
